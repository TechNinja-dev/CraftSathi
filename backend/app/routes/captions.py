from fastapi import APIRouter, Query
from app.models.user_models import SaveCaptionRequest
import app.controllers.captions_controller as captions_ctrl

router = APIRouter(tags=["Captions"])

@router.post("/api/save-caption")
async def save_caption(request: SaveCaptionRequest):
    return await captions_ctrl.save_caption(request)

@router.get("/api/get-captions")
async def get_captions(userId: str):
    return await captions_ctrl.get_captions(userId)

@router.delete("/api/delete-caption")
async def delete_caption(
    userId: str = Query(...),
    image_id: str = Query(...),
    captionIndex: int = Query(...)
):
    return await captions_ctrl.delete_caption(userId, image_id, captionIndex)

@router.delete("/api/delete-caption-group")
async def delete_caption_group(
    userId: str = Query(...),
    image_id: str = Query(...)
):
    return await captions_ctrl.delete_caption_group(userId, image_id)