import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, ValidationError
from pymongo import MongoClient
import firebase_admin
from firebase_admin import credentials, auth
import base64
# from google.generativeai import configure, GenerativeModel
import datetime
from google import genai
import google.generativeai as genaigg
from google.genai import types



# --- Configuration & Initialization ---
load_dotenv()
app = FastAPI()
conn=MongoClient(os.getenv("MONGO_URI"))
db=conn.get_database("CraftSathi") 
user_col = db.get_collection('users')
images_col = db.get_collection('images')



# --- Middleware ---
origins = ["http://localhost:3000",
           "https://craft-sathi-wbof-1cevp472e.vercel.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Firebase Admin SDK Initialization (Manual Method from .env) ---
try:
    if not firebase_admin._apps:
        # Manually build the credentials dictionary from environment variables
        firebase_credentials = {
            "type": os.getenv("type"),
            "project_id": os.getenv("project_id"),
            "private_key_id": os.getenv("private_key_id"),
            # This line is crucial: it correctly formats the private key
            "private_key": os.getenv("private_key", "").replace('\\n', '\n'),
            "client_email": os.getenv("client_email"),
            "client_id": os.getenv("client_id"),
            "auth_uri": os.getenv("auth_uri"),
            "token_uri": os.getenv("token_uri"),
            "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
            "client_x509_cert_url": os.getenv("client_x509_cert_url"),
        }
        
        # Check if essential credentials are provided to give a clear error
        if not all([firebase_credentials["project_id"], firebase_credentials["private_key"], firebase_credentials["client_email"]]):
            raise ValueError("Essential Firebase credential environment variables (project_id, private_key, client_email) are missing.")

        cred = credentials.Certificate(firebase_credentials)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully from .env variables!")
except Exception as e:
    print(f"🔥 Error initializing Firebase Admin SDK: {e}")


# --- Pydantic Models for Data Validation ---
class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str


# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the CraftSathi API"}

@app.post("/auth/register", response_model=TokenResponse, status_code=201)
async def register_user(user_data: UserRegisterSchema):
    try:
        user_record = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.name
        )
        custom_token = auth.create_custom_token(user_record.uid)
        creds={"u_Id":user_record.uid,"u_name":user_data.name,"u_mail":user_data.email,"u_pwd":user_data.password}
        user_col.insert_one(creds)
        print("User registered")
        return {"token": custom_token}

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/auth")
def sox():
    print("Authentication pages is live")
@app.post("/auth/login", response_model=TokenResponse)
async def login_user(user_data: UserLoginSchema):
    firebase_web_api_key = os.getenv("FIREBASE_API_KEY")
    if not firebase_web_api_key:
        raise HTTPException(status_code=500, detail="Firebase Web API Key is not configured.")
        
    rest_api_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={firebase_web_api_key}"
    payload = {
        "email": user_data.email,
        "password": user_data.password,
        "returnSecureToken": True
    }
    
    try:
        response = requests.post(rest_api_url, json=payload)
        response.raise_for_status()
        user_uid = response.json().get("localId")
        if not user_uid:
            raise HTTPException(status_code=500, detail="Failed to retrieve user ID.")
        rel=user_col.find_one({"u_Id": user_uid})
        print(rel['u_name'])
        custom_token = auth.create_custom_token(user_uid)
        return {"token": custom_token}
    except requests.exceptions.HTTPError:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected server error: {str(e)}")

# Add this new Pydantic model at the top with your other models
class GoogleAuthSchema(BaseModel):
    token: str

@app.post("/auth/google", response_model=TokenResponse)
async def google_auth(data: GoogleAuthSchema):
    print("google endpoint")
    try:
        # Verify the ID token from the frontend
        decoded_token = auth.verify_id_token(data.token)
        uid = decoded_token['uid']
        
        # Check if user already exists in Firebase
        try:
            user_record = auth.get_user(uid)
            print(f"User {user_record.uid} already exists.")
        except auth.UserNotFoundError:
            # If user doesn't exist, create them
            user_info = {
                'uid': uid,
                'email': decoded_token.get('email'),
                'display_name': decoded_token.get('name')
            }
            m_db={"u_Id":uid, "u_name":decoded_token.get('name'),"u_mail":decoded_token.get('email'),"u_pwd":None}
            user_col.insert_one(m_db)
            user_record = auth.create_user(**user_info)
            print(f"New user created with UID: {user_record.uid}")

        # Create a custom token for the user
        custom_token = auth.create_custom_token(uid)
        return {"token": custom_token}

    except auth.InvalidIdTokenError as e:
        raise HTTPException(status_code=401, detail="Invalid ID token.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected server error: {str(e)}")

# Add this new Pydantic model at the top with your other models
class ImagePayload(BaseModel):
    image: str
@app.post("/api/generate")
async def generate_content(file: UploadFile = File(...)):
    try:
        # Read the file's content directly as binary data
        contents = await file.read()
        
        # Configure Gemini with your API key from .env
        genaigg.configure(api_key=os.getenv("IMG_API_KEY"))
        
        # Initialize the Gemini model for image understanding
        model = genaigg.GenerativeModel(model_name="gemini-1.5-pro-latest")
        
        # Prepare the prompt and image data for the Gemini API call
        response = model.generate_content([
            "Generate a product description for this item. Use a sentimental and marketing-focused tone to make the consumer feel a personal connection to the product. The description should be compelling and persuade them to buy.",
            {"mime_type": file.content_type, "data": contents}
        ])
        
        # Log a success message
        print(f"✅ Received file: {file.filename}, with size: {len(contents)} bytes")

        # Return the description from Gemini to the frontend
        return {"message": response.text}
    
    except Exception as e:
        # Catch any errors from the Gemini API or file processing
        print(f"🔥 Error during file processing: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process the uploaded file: {str(e)}")

class PhotoResponse(BaseModel):
    image_url: str

class PhotoRequest(BaseModel):
    prompt: str
    userId: str | None = None
    

@app.post("/api/generate-photo", response_model=PhotoResponse)
async def generate_photo(request: PhotoRequest):
    try:
        # initialize client
        client = genai.Client(api_key=os.getenv("IMG2_API_KEY"))

        # use client.models.generate_content
        response = client.models.generate_content(
            model="gemini-2.0-flash-preview-image-generation",  
            contents=[types.Part.from_text(text=request.prompt)],
            config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"])
        )

        # Extract the image data
        parts = response.candidates[0].content.parts
        base64_image = None
        # Extract base64 image
        for part in response.candidates[0].content.parts:
            inline_data = getattr(part, "inline_data", None)
            if inline_data and inline_data.mime_type.startswith("image/"):
                base64_image = base64.b64encode(inline_data.data).decode("utf-8")
                base64_image = base64_image.strip().replace("\n", "").replace("\r", "")
                mime_type = inline_data.mime_type
                break
            
        if not base64_image:
            raise HTTPException(status_code=500, detail="No image data returned by the model.")

        image_url = f"data:{mime_type};base64,{base64_image}"

        # Save in MongoDB if userId provided
        if request.userId:
            print(request.userId)
            user_doc = user_col.find_one({"u_Id": request.userId})
            if user_doc:
                image_doc = {
                    "user_id": user_doc["_id"],
                    "prompt": request.prompt,
                    "image_url": image_url,
                    "created_at": datetime.datetime.utcnow()
                }
                images_col.insert_one(image_doc)

        return {"image_url": image_url}

    except Exception as e:
        print(f"🔥 Error generating image: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
class MyStuffResponse(BaseModel):
    images: list

@app.get("/api/mystuff", response_model=MyStuffResponse)
async def get_my_stuff(userId: str):
    try:
        # Find the user in the 'users' collection by their Firebase UID (u_Id)
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            return {"images": []}

        user_oid = user_doc['_id']
        images_cursor = images_col.find({"user_id": user_oid}).sort("created_at", -1)
        images = []
        for doc in images_cursor:
            doc['id'] = str(doc['_id'])
            doc['created_at'] = doc['created_at'].isoformat()
            doc['_id'] = str(doc['_id'])
            doc['user_id'] = str(doc['user_id']) 
            images.append(doc)

        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


@app.delete("/api/delete-image")
async def delete_image(imageId: str, userId: str):
    try:
        # Find the user's document in the users collection to get their MongoDB ObjectId
        user_doc = user_col.find_one({"u_Id": userId})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found.")
        
        user_oid = user_doc['_id']

        # Convert the imageId string to a MongoDB ObjectId
        image_oid = ObjectId(imageId)

        # Attempt to delete the image document
        # We ensure that only the correct user can delete their image by checking both IDs
        result = images_col.delete_one({"_id": image_oid, "user_id": user_oid})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Image not found or you do not have permission to delete it.")

        return {"message": "Image deleted successfully."}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")