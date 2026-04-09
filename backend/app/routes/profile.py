from fastapi import APIRouter
from app.models.user_models import ProfileUpdateRequest, PrivateAvatarUpdateRequest, PrivateAvatarRemoveRequest
import app.controllers.personal_dashboard_controller as profile_ctrl

router = APIRouter()

@router.get("/api/profile")
async def get_profile(userId: str):
    return await profile_ctrl.get_profile(userId)

@router.put("/api/profile/update")
async def update_profile(data: ProfileUpdateRequest):
    return await profile_ctrl.update_profile(data)

@router.put("/api/profile/update-avatar")
async def update_avatar(data: PrivateAvatarUpdateRequest):
    return await profile_ctrl.update_avatar(data)

@router.put("/api/profile/remove-avatar")
async def remove_avatar(data: PrivateAvatarRemoveRequest):
    return await profile_ctrl.remove_avatar(data)