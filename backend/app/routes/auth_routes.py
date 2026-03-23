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
        
        # Create user in Firebase
        try:
            user_record = auth.create_user(
                email=user_data.email,
                password=user_data.password,
                display_name=user_data.name
            )
            print(f"Firebase user created with UID: {user_record.uid}")
        except auth.EmailAlreadyExistsError:
            print(f"Email already exists in Firebase: {user_data.email}")
            raise HTTPException(status_code=400, detail="Email already registered. Please login instead.")
        except Exception as firebase_error:
            print(f"Firebase error: {str(firebase_error)}")
            raise HTTPException(status_code=400, detail=f"Firebase error: {str(firebase_error)}")

        uid = user_record.uid

        # Store in MongoDB with password
        try:
            result = user_col.insert_one({
                "u_Id": uid,
                "u_name": user_data.name,
                "u_mail": user_data.email,
                "u_pwd": user_data.password  # Store plain text password
            })
            print(f"User inserted into MongoDB with ID: {result.inserted_id}")
            
            # Get the inserted user document
            user_doc = user_col.find_one({"_id": result.inserted_id})
            
        except Exception as mongo_error:
            print(f"MongoDB error: {str(mongo_error)}")
            # Delete the Firebase user if MongoDB fails
            try:
                auth.delete_user(uid)
                print(f"Deleted Firebase user {uid} due to MongoDB error")
            except:
                pass
            raise HTTPException(status_code=500, detail=f"Database error: {str(mongo_error)}")

        # Create Firebase custom token
        token = auth.create_custom_token(uid)

        return {
            "token": token.decode("utf-8"),
            "user": {
                "uid": uid,
                "u_Id": uid,
                "u_name": user_data.name,
                "u_mail": user_data.email,
                "id": str(user_doc["_id"])
            },
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
        email = user_data.email
        password = user_data.password
        
        # 🔍 Find user in MongoDB by email
        user = user_col.find_one({"u_mail": email})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 🔐 Verify password from MongoDB
        stored_password = user.get("u_pwd")
        
        if not stored_password:
            raise HTTPException(status_code=401, detail="Please login with Google. No password set for this account.")
        
        if stored_password != password:
            raise HTTPException(status_code=401, detail="Invalid password")
        
        # Get user details
        uid = user.get("u_Id")
        name = user.get("u_name", "")
        
        # 🎟️ Create custom token for frontend
        custom_token = auth.create_custom_token(uid)
        
        return {
            "token": custom_token.decode("utf-8"),
            "user": {
                "uid": uid,
                "u_Id": uid,
                "u_name": name,
                "u_mail": email,
                "id": str(user["_id"]),
                "has_password": True
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
otp_store = {}


@router.post("/google")
async def google_login(data: dict):
    print("🔵 GOOGLE LOGIN ENDPOINT CALLED")
    print(f"Received data: {data}")
    
    try:
        token = data.get("token")
        
        if not token:
            raise HTTPException(status_code=400, detail="Token missing")
        
        # Verify Firebase ID token
        decoded = None
        for skew in [60, 120, 300]:
            try:
                decoded = auth.verify_id_token(token, clock_skew_seconds=skew)
                if decoded:
                    break
            except:
                continue
        
        if not decoded:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        name_from_frontend = data.get("name")
        uid = decoded["uid"]
        email = decoded.get("email", "")
        name = name_from_frontend or decoded.get("name", "")
        
        otp_verified = data.get("otp_verified", False)
        
        # Check if user exists
        user = user_col.find_one({"u_Id": uid})
        
        # If OTP is verified, handle user creation/login
        if otp_verified:
            print("🔵 OTP IS VERIFIED - PROCESSING LOGIN")
            
            if not user:
                # NEW USER - CREATE IN DATABASE
                print("🆕 CREATING NEW USER IN DATABASE")
                result = user_col.insert_one({
                    "u_Id": uid,
                    "u_name": name,
                    "u_mail": email,
                    "u_pwd": None,
                    "created_at": datetime.datetime.utcnow()
                })
                print(f"✅ User created with ID: {result.inserted_id}")
                user_doc = user_col.find_one({"_id": result.inserted_id})
                
                # Clean up OTP from memory
                if email in otp_store:
                    del otp_store[email]
                
                # Create custom token
                custom_token = auth.create_custom_token(uid)
                
                return {
                    "token": custom_token.decode("utf-8"),
                    "is_new_user": True,
                    "user": {
                        "uid": uid,
                        "u_Id": uid,
                        "u_name": name,
                        "u_mail": email,
                        "id": str(user_doc["_id"]),
                        "has_password": False
                    }
                }
            else:
                # EXISTING USER - JUST LOGIN
                print(f"✅ Existing user found: {email}")
                user_doc = user
                
                custom_token = auth.create_custom_token(uid)
                
                if email in otp_store:
                    del otp_store[email]
                
                return {
                    "token": custom_token.decode("utf-8"),
                    "user": {
                        "uid": uid,
                        "u_Id": uid,
                        "u_name": user_doc.get("u_name", name),
                        "u_mail": user_doc.get("u_mail", email),
                        "id": str(user_doc["_id"]),
                        "has_password": user_doc.get("u_pwd") is not None
                    }
                }
        
        # Step 2: OTP not verified - send OTP
        print("🔵 OTP NOT VERIFIED - SENDING OTP")
        current_time = datetime.datetime.utcnow()
        existing_otp = otp_store.get(email)
        
        # Check cooldown
        if existing_otp and existing_otp.get("last_sent_at"):
            time_since_last = (current_time - existing_otp["last_sent_at"]).total_seconds()
            if time_since_last < 120:
                remaining = int(120 - time_since_last)
                return {
                    "requires_otp": True,
                    "message": f"Please wait {remaining} seconds",
                    "email": email,
                    "expires_in": 300,
                    "cooldown": remaining
                }
        
        # Generate and send new OTP
        otp = secrets.token_hex(3)[:6].upper()
        otp_store[email] = {
            "otp": otp,
            "expires_at": current_time + datetime.timedelta(minutes=5),
            "last_sent_at": current_time,
            "uid": uid,
            "name": name
        }
        
        send_otp_email(email, otp)
        
        return {
            "requires_otp": True,
            "message": "OTP sent to your email",
            "email": email,
            "expires_in": 300,
            "cooldown": 120
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
    

@router.post("/set-password")
async def set_password(data: dict):
    print("🔐 SET PASSWORD ENDPOINT CALLED")
    print(f"Received data: {data}")
    
    try:
        email = data.get("email")
        password = data.get("password")
        token = data.get("token")
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password required")
        
        if not token:
            raise HTTPException(status_code=400, detail="Token required")
        
        # Verify the Firebase token
        decoded = auth.verify_id_token(token)
        token_uid = decoded["uid"]
        print(f"✅ Token verified - UID from token: {token_uid}")
        
        # Find user by EMAIL (not by UID)
        user = user_col.find_one({"u_mail": email})
        print(f"🔍 User found by email: {user is not None}")
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get the stored UID from the user document
        stored_uid = user.get("u_Id")
        print(f"📦 Stored UID: {stored_uid}")
        print(f"🔑 Token UID: {token_uid}")
        
        # Update user with password (using the stored UID)
        result = user_col.update_one(
            {"u_mail": email},
            {"$set": {"u_pwd": password}}
        )
        
        print(f"📊 Update result - matched: {result.matched_count}, modified: {result.modified_count}")
        
        user_doc = user_col.find_one({"u_mail": email})
        
        # Create custom token using the stored UID (not the token UID)
        custom_token = auth.create_custom_token(stored_uid)
        
        return {
            "token": custom_token.decode("utf-8"),
            "user": {
                "uid": stored_uid,
                "u_Id": stored_uid,
                "u_name": user_doc.get("u_name"),
                "u_mail": user_doc.get("u_mail"),
                "id": str(user_doc["_id"])
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Set password error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))