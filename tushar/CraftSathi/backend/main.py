import os
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth

# Load environment variables from a .env file (optional, for local development)
load_dotenv()

# Initialize the FastAPI app
app = FastAPI()

# --- CORS Middleware Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# --- Firebase Admin SDK Initialization ---
SERVICE_ACCOUNT_KEY_FILE = "serviceAccountKey.json"

if not os.path.exists(SERVICE_ACCOUNT_KEY_FILE):
    raise FileNotFoundError(
        f"Firebase service account key file not found at '{SERVICE_ACCOUNT_KEY_FILE}'. "
        "Please download it from your Firebase project settings and place it in the root directory."
    )

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_FILE)
        firebase_admin.initialize_app(cred)
except Exception as e:
    raise RuntimeError(f"Failed to initialize Firebase Admin SDK: {e}")


# --- API Endpoints ---

@app.get("/")
async def read_root():
    """
    A simple root endpoint to confirm the API is running.
    """
    return {"message": "Backend API for Video Generation and Firebase is running"}

@app.post("/api/generate-video")
async def generate_video_proxy(request: Request):
    """
    This endpoint acts as a secure proxy to the JSON2Video API.
    """
    API_KEY = 'iZTI6Ug6mdcfNpB6EeofVNImEFooDymZWMrQKq3x'

    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="JSON2VIDEO_API_KEY is not set on the server."
        )

    try:
        video_data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON data in request body.")

    video_api_url = "https://api.json2video.com/v2/movies"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(video_api_url, headers=headers, json=video_data, timeout=60.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            error_details = e.response.json().get("message", e.response.text)
            raise HTTPException(status_code=e.response.status_code, detail=error_details)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")

@app.get("/api/user/{user_id}")
async def get_user_info(user_id: str):
    """
    Fetches user information from Firebase Authentication using their UID.
    """
    try:
        user = auth.get_user(user_id)
        user_info = {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name,
            "photo_url": user.photo_url,
            "email_verified": user.email_verified,
            "disabled": user.disabled,
            "provider_data": [provider.provider_id for provider in user.provider_data]
        }
        return user_info
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail=f"User with ID '{user_id}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

# --- How to Run This Application ---
# 1. Save this file as main.py
# 2. Make sure you have a 'serviceAccountKey.json' file in the same directory.
# 3. Create a '.env' file for your video API key: JSON2VIDEO_API_KEY=your_key_here
# 4. In your terminal, run:
#    pip install "fastapi[all]" python-dotenv httpx firebase-admin
# 5. Then, start the server:
#    uvicorn main:app --reload

