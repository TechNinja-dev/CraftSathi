import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URI = os.getenv("MONGO_URI")
    FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")

settings = Settings()