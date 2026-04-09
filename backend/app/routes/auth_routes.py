from fastapi import APIRouter
from app.models.user_models import UserRegisterSchema, UserLoginSchema
import app.controllers.auth_controller as auth_ctrl

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register_user(user_data: UserRegisterSchema):
    return await auth_ctrl.register_user(user_data)

@router.post("/login")
async def login_user(user_data: UserLoginSchema):
    return await auth_ctrl.login_user(user_data)

@router.post("/google")
async def google_login(data: dict):
    return await auth_ctrl.google_login(data)

@router.post("/google/resend-otp")
async def resend_otp(data: dict):
    return await auth_ctrl.resend_otp(data)

@router.post("/google/verify-otp")
async def verify_google_otp(data: dict):
    return await auth_ctrl.verify_google_otp(data)

@router.post("/set-password")
async def set_password(data: dict):
    return await auth_ctrl.set_password(data)