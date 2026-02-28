# import os
# import requests
# import base64
# import datetime
# from dotenv import load_dotenv
# from fastapi import FastAPI, HTTPException, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, EmailStr
# from pymongo import MongoClient
# import firebase_admin
# from firebase_admin import credentials, auth
# from google import genai
# import google.generativeai as genai  ##added

# from google.genai import types
# from bson import ObjectId

# # --- Configuration & Initialization ---
# load_dotenv()
# app = FastAPI()

# # MongoDB setup
# conn = MongoClient(os.getenv("MONGO_URI"))
# db = conn.get_database("CraftSathi")
# user_col = db.get_collection('users')
# images_col = db.get_collection('images')

# # --- Middleware ---
# origins = [
#     "http://localhost:3000",
#     "https://craft-sathi-wbof.vercel.app"
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Firebase Admin SDK Initialization ---
# try:
#     if not firebase_admin._apps:
#         firebase_credentials = {
#             "type": os.getenv("type"),
#             "project_id": os.getenv("project_id"),
#             "private_key_id": os.getenv("private_key_id"),
#             "private_key": os.getenv("private_key", "").replace('\\n', '\n'),
#             "client_email": os.getenv("client_email"),
#             "client_id": os.getenv("client_id"),
#             "auth_uri": os.getenv("auth_uri"),
#             "token_uri": os.getenv("token_uri"),
#             "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
#             "client_x509_cert_url": os.getenv("client_x509_cert_url"),
#         }
#         cred = credentials.Certificate(firebase_credentials)
#         firebase_admin.initialize_app(cred)
#         print("✅ Firebase Admin SDK initialized successfully!")
# except Exception as e:
#     print(f"🔥 Error initializing Firebase Admin SDK: {e}")

# # --- Pydantic Models ---
# class UserRegisterSchema(BaseModel):
#     name: str
#     email: EmailStr
#     password: str

# class UserLoginSchema(BaseModel):
#     email: EmailStr
#     password: str

# class TokenResponse(BaseModel):
#     token: str

# class GoogleAuthSchema(BaseModel):
#     token: str

# class PhotoRequest(BaseModel):
#     prompt: str
#     userId: str | None = None

# class PhotoResponse(BaseModel):
#     image_url: str

# class MyStuffResponse(BaseModel):
#     images: list

# # --- API Endpoints ---

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the CraftSathi API"}

# @app.post("/auth/register", response_model=TokenResponse, status_code=201)
# async def register_user(user_data: UserRegisterSchema):
#     try:
#         user_record = auth.create_user(
#             email=user_data.email,
#             password=user_data.password,
#             display_name=user_data.name
#         )
#         custom_token = auth.create_custom_token(user_record.uid)
#         user_col.insert_one({
#             "u_Id": user_record.uid,
#             "u_name": user_data.name,
#             "u_mail": user_data.email,
#             "u_pwd": user_data.password
#         })
#         return {"token": custom_token}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/auth/login", response_model=TokenResponse)
# async def login_user(user_data: UserLoginSchema):
#     api_key = os.getenv("FIREBASE_API_KEY")
#     url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
#     payload = {"email": user_data.email, "password": user_data.password, "returnSecureToken": True}
#     try:
#         response = requests.post(url, json=payload)
#         response.raise_for_status()
#         uid = response.json().get("localId")
#         return {"token": auth.create_custom_token(uid)}
#     except Exception:
#         raise HTTPException(status_code=401, detail="Invalid credentials")

# # 1. GENERATE CAPTION (Image-to-Text)
# @app.post("/api/generate")
# async def generate_content(file: UploadFile = File(...)):
#     try:
#         image_bytes = await file.read()

#         genai.configure(api_key=os.getenv("IMG_API_KEY"))

#         model = genai.GenerativeModel("gemini-pro-vision")

#         response = model.generate_content([
#             {
#                 "mime_type": file.content_type,
#                 "data": image_bytes
#             },
#             "Generate a professional product description for this item. "
#             "Use a sentimental and marketing-focused tone. "
#             "Highlight the craftsmanship."
#         ])

#         return {"message": response.text}

#     except Exception as e:
#         print(f"🔥 Description Error: {e}")
#         raise HTTPException(
#             status_code=500,
#             detail=f"AI Processing Error: {str(e)}"
#         )



# # 2. GENERATE PHOTO (Text-to-Image)
# @app.post("/api/generate-photo", response_model=PhotoResponse)
# async def generate_photo(request: PhotoRequest):
#     try:
#         client = genai.Client(api_key=os.getenv("IMG2_API_KEY"))
        
#         # Using gemini-2.0-flash which supports image generation in many regions
#         response = client.models.generate_content(
#             model="gemini-2.0-flash", 
#             contents=[types.Part.from_text(text=request.prompt)],
#             config=types.GenerateContentConfig(response_modalities=["IMAGE"])
#         )

#         base64_image = None
#         mime_type = "image/png"
        
#         # Modern SDK returns raw bytes in part.inline_data.data
#         for part in response.candidates[0].content.parts:
#             if part.inline_data:
#                 base64_image = base64.b64encode(part.inline_data.data).decode("utf-8")
#                 mime_type = part.inline_data.mime_type
#                 break

#         if not base64_image:
#             raise HTTPException(status_code=500, detail="No image returned by the model.")

#         image_url = f"data:{mime_type};base64,{base64_image}"

#         # Save to Mongo if userId provided
#         if request.userId:
#             user_doc = user_col.find_one({"u_Id": request.userId})
#             if user_doc:
#                 images_col.insert_one({
#                     "user_id": user_doc["_id"],
#                     "prompt": request.prompt,
#                     "image_url": image_url,
#                     "created_at": datetime.datetime.utcnow()
#                 })

#         return {"image_url": image_url}
#     except Exception as e:
#         print(f"🔥 Photo Generation Error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/api/mystuff", response_model=MyStuffResponse)
# async def get_my_stuff(userId: str):
#     try:
#         user_doc = user_col.find_one({"u_Id": userId})
#         if not user_doc: return {"images": []}
        
#         cursor = images_col.find({"user_id": user_doc["_id"]}).sort("created_at", -1)
#         images = []
#         for doc in cursor:
#             doc['id'] = str(doc['_id'])
#             doc['created_at'] = doc['created_at'].isoformat()
#             del doc['_id']
#             del doc['user_id']
#             images.append(doc)
#         return {"images": images}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.delete("/api/delete-image")
# async def delete_image(imageId: str, userId: str):
#     try:
#         user_doc = user_col.find_one({"u_Id": userId})
#         if not user_doc: raise HTTPException(status_code=404, detail="User not found")
        
#         result = images_col.delete_one({"_id": ObjectId(imageId), "user_id": user_doc["_id"]})
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Image not found")
#         return {"message": "Image deleted successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, ai_routes, image_routes
from app.core.firebase import initialize_firebase

app = FastAPI(title="CraftSathi API")

initialize_firebase()

origins = [
    "http://localhost:3000",
    "https://craft-sathi-wbof.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(ai_routes.router)
app.include_router(image_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CraftSathi API"}