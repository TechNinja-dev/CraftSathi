from fastapi import APIRouter
from app.models.ai_models import MyStuffResponse
import app.controllers.image_controller as image_ctrl

router = APIRouter(prefix="/api", tags=["Images"])

@router.get("/mystuff", response_model=MyStuffResponse)
async def get_my_stuff(userId: str):
    return await image_ctrl.get_my_stuff(userId)

@router.delete("/delete-image")
async def delete_image(imageId: str, userId: str):
    return await image_ctrl.delete_image(imageId, userId)