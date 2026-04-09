from fastapi import APIRouter
import app.controllers.video_controller as video_ctrl

router = APIRouter(prefix="/api", tags=["Videos"])

@router.get("/get-videos")
async def get_videos(userId: str):
    return await video_ctrl.get_videos(userId)

@router.delete("/delete-video")
async def delete_video(videoId: str, userId: str):
    return await video_ctrl.delete_video(videoId, userId)
