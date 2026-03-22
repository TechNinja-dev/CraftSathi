from fastapi import APIRouter, HTTPException
from firebase_admin import auth
from app.db.mongodb import user_col
from app.models.user_models import *
import requests
from app.core.config import settings
from app.services.email_service import send_otp_email
import secrets
import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register_user(user_data: UserRegisterSchema):
    try:
        print(f"Attempting to register user: {user_data.email}")  # Debug log
        
        # 🔧 FIX: Create user in Firebase
        try:
            user_record = auth.create_user(
                email=user_data.email,
                password=user_data.password,
                display_name=user_data.name
            )
            print(f"Firebase user created with UID: {user_record.uid}")  # Debug log
        except auth.EmailAlreadyExistsError:
            print(f"Email already exists in Firebase: {user_data.email}")
            raise HTTPException(status_code=400, detail="Email already registered. Please login instead.")
        except Exception as firebase_error:
            print(f"Firebase error: {str(firebase_error)}")
            raise HTTPException(status_code=400, detail=f"Firebase error: {str(firebase_error)}")

        uid = user_record.uid

        # 🔧 FIX: Store in MongoDB with better error handling
        try:
            result = user_col.insert_one({
                "u_Id": uid,
                "u_name": user_data.name,
                "u_mail": user_data.email
            })
            print(f"User inserted into MongoDB with ID: {result.inserted_id}")
        except Exception as mongo_error:
            print(f"MongoDB error: {str(mongo_error)}")
            # Optional: Delete the Firebase user if MongoDB fails
            try:
                auth.delete_user(uid)
                print(f"Deleted Firebase user {uid} due to MongoDB error")
            except:
                pass
            raise HTTPException(status_code=500, detail=f"Database error: {str(mongo_error)}")

        # 🎟️ Create Firebase custom token
        token = auth.create_custom_token(uid)

        return {
            "token": token.decode("utf-8"),
            "message": "User registered successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    


@router.post("/login")
async def login_user(user_data: UserLoginSchema):
    try:
        # 🔐 Verify with Firebase (email/password)
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={settings.FIREBASE_API_KEY}"

        payload = {
            "email": user_data.email,
            "password": user_data.password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        data = response.json()
        uid = data["localId"]

        # 🔍 Check MongoDB for existing user
        user = user_col.find_one({"u_Id": uid})

        if not user:
            # User exists in Firebase but not in MongoDB
            # This shouldn't happen with proper registration flow
            raise HTTPException(
                status_code=404, 
                detail="User not found. Please register first."
            )

        # 🎟️ Create custom token for frontend
        token = auth.create_custom_token(uid)

        return {
            "token": token.decode("utf-8"),
            "user": {
                "id": str(user["_id"]),
                "u_Id": user["u_Id"],
                "u_name": user["u_name"],
                "u_mail": user["u_mail"]
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
otp_store = {}


@router.post("/google")
async def google_login(data: dict):
    try:
        token = data.get("token")
        
        if not token:
            raise HTTPException(status_code=400, detail="Token missing")
        
        # Verify Firebase ID token with clock skew tolerance
        decoded = None
        errors = []
        
        for skew in [60, 120, 300]:
            try:
                decoded = auth.verify_id_token(token, clock_skew_seconds=skew)
                if decoded:
                    print(f"Token verified with {skew}s clock skew")
                    break
            except Exception as e:
                errors.append(f"Skew {skew}s: {str(e)}")
                continue
        
        if not decoded:
            print(f"All token verification attempts failed: {errors}")
            raise HTTPException(status_code=401, detail="Invalid token - please sync your system clock")
        
        name_from_frontend = data.get("name")
        
        uid = decoded["uid"]
        email = decoded.get("email", "")
        name = name_from_frontend or decoded.get("name", "")
        
        # Check if OTP already verified for this session
        otp_verified = data.get("otp_verified", False)
        
        # Check MongoDB for existing user
        user = user_col.find_one({"u_Id": uid})
        
        # If user doesn't exist OR OTP not verified, send OTP
        if not user or not otp_verified:
            # Check if we've already sent OTP recently (2-minute cooldown)
            current_time = datetime.datetime.utcnow()
            existing_otp = otp_store.get(email)
            
            if existing_otp:
                last_sent = existing_otp.get("last_sent_at")
                if last_sent:
                    time_since_last = (current_time - last_sent).total_seconds()
                    if time_since_last < 120:  # 2 minutes = 120 seconds
                        remaining = int(120 - time_since_last)
                        return {
                            "requires_otp": True,
                            "message": f"Please wait {remaining} seconds before requesting a new OTP",
                            "email": email,
                            "expires_in": 300,
                            "cooldown": remaining
                        }
            
            # Generate new 6-digit OTP
            otp = secrets.token_hex(3)[:6].upper()
            
            # Store OTP in memory with 5-minute expiration and track last sent time
            otp_store[email] = {
                "otp": otp,
                "expires_at": current_time + datetime.timedelta(minutes=5),
                "last_sent_at": current_time,
                "uid": uid
            }
            
            # Send OTP via email
            email_sent = send_otp_email(email, otp)
            
            if email_sent:
                return {
                    "requires_otp": True,
                    "message": "OTP sent to your email",
                    "email": email,
                    "expires_in": 300,
                    "cooldown": 120
                }
            else:
                return {
                    "requires_otp": True,
                    "message": "Failed to send OTP. Please try again.",
                    "email": email,
                    "expires_in": 300
                }
        
        # If OTP is verified or user exists and OTP not required, proceed with login
        if not user:
            user_col.insert_one({
                "u_Id": uid,
                "u_name": name,
                "u_mail": email
            })
        
        # Create custom token
        custom_token = auth.create_custom_token(uid)
        
        # Clean up OTP from memory if exists
        if email in otp_store:
            del otp_store[email]
        
        return {
            "token": custom_token.decode("utf-8"),
            "user": {
                "uid": uid,
                "u_Id": uid,  # Make sure u_Id is included
                "u_name": name,
                "u_mail": email,
                "id": str(user_doc["_id"]) if user_doc else None
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Google login error: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/google/resend-otp")
async def resend_otp(data: dict):
    """
    Resend OTP with 2-minute cooldown check
    """
    try:
        email = data.get("email")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email required")
        
        current_time = datetime.datetime.utcnow()
        existing_otp = otp_store.get(email)
        
        # Check cooldown period (2 minutes)
        if existing_otp and existing_otp.get("last_sent_at"):
            time_since_last = (current_time - existing_otp["last_sent_at"]).total_seconds()
            if time_since_last < 120:
                remaining = int(120 - time_since_last)
                raise HTTPException(
                    status_code=429, 
                    detail=f"Please wait {remaining} seconds before requesting a new OTP"
                )
        
        # Generate new OTP
        new_otp = secrets.token_hex(3)[:6].upper()
        
        # Update stored OTP with new values
        otp_store[email] = {
            "otp": new_otp,
            "expires_at": current_time + datetime.timedelta(minutes=5),
            "last_sent_at": current_time,
            "uid": existing_otp.get("uid") if existing_otp else None
        }
        
        # Send new OTP via email
        email_sent = send_otp_email(email, new_otp)
        
        if email_sent:
            return {
                "message": "New OTP sent successfully",
                "email": email,
                "expires_in": 300,
                "cooldown": 120
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Resend OTP error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/google/verify-otp")
async def verify_google_otp(data: dict):
    try:
        email = data.get("email")
        otp = data.get("otp")
        
        if not email or not otp:
            raise HTTPException(status_code=400, detail="Email and OTP required")
        
        # Check if OTP exists in memory
        if email not in otp_store:
            raise HTTPException(status_code=404, detail="OTP not found. Please request a new one.")
        
        stored_data = otp_store[email]
        
        # Check if expired
        if stored_data["expires_at"] < datetime.datetime.utcnow():
            del otp_store[email]
            raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
        
        # Verify OTP
        if stored_data["otp"] != otp:
            raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")
        
        # OTP verified successfully
        return {
            "verified": True,
            "message": "OTP verified successfully",
            "uid": stored_data["uid"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"OTP verification error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))