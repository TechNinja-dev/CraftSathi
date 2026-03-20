from fastapi import APIRouter, HTTPException
from firebase_admin import auth
from app.db.mongodb import user_col
from app.models.user_models import *
import requests
from app.core.config import settings

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

@router.post("/google")
async def google_login(data: dict):
    try:
        token = data.get("token")

        if not token:
            raise HTTPException(status_code=400, detail="Token missing")

        # 🔐 Verify Firebase ID token
        decoded = auth.verify_id_token(token)
        name_from_frontend = data.get("name")

        uid = decoded["uid"]
        email = decoded.get("email", "")
        name = name_from_frontend or decoded.get("name", "")

        # 🔍 Check MongoDB
        user = user_col.find_one({"u_Id": uid})

        if not user:
            user_col.insert_one({
                "u_Id": uid,
                "u_name": name,
                "u_mail": email
            })

        # 🎟️ Create custom token
        custom_token = auth.create_custom_token(uid)

        return {
            "token": custom_token.decode("utf-8")
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))