from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGO_URI)
db = client.get_database("CraftSathi")

user_col = db.get_collection("users")
images_col = db.get_collection("images")