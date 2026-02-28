from fastapi import APIRouter, HTTPException
from firebase_admin import auth
import requests
from app.models.user_models import *
from app.db.mongodb import user_col
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register_user(user_data: UserRegisterSchema):
    try:
        user_record = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.name
        )
        token = auth.create_custom_token(user_record.uid)

        user_col.insert_one({
            "u_Id": user_record.uid,
            "u_name": user_data.name,
            "u_mail": user_data.email,
            "u_pwd": user_data.password
        })

        return {"token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))