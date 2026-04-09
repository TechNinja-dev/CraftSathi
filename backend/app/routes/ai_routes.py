from fastapi import APIRouter, UploadFile, File, HTTPException,Form
from app.services.ai_service import generate_caption, generate_image, generate_video as generate_video_service
from app.models.ai_models import *

router = APIRouter(prefix="/api", tags=["AI"])

@router.post("/generate")
async def generate_content(userId: str | None=Form(None),file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        message = generate_caption(image_bytes, file.content_type,userId)
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-photo", response_model=PhotoResponse)
async def generate_photo(request: PhotoRequest):
    result = generate_image(request.prompt, request.userId)
    if isinstance(result, dict) and "message" in result:
        return result
    if not result:
        raise HTTPException(status_code=500, detail="Image generation failed")
    return {"image_url": result}


@router.post("/generate-video", response_model=VideoResponse)
async def generate_video(request: VideoRequest):
    result = generate_video_service(request.prompt, request.userId)
    if isinstance(result, dict) and "message" in result:
        return result
    if not result:
        raise HTTPException(status_code=500, detail="Video generation failed")
    return {"video_url": result}
