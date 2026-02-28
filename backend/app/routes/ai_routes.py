from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ai_service import generate_caption, generate_image
from app.models.ai_models import *

router = APIRouter(prefix="/api", tags=["AI"])

@router.post("/generate")
async def generate_content(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        message = generate_caption(image_bytes, file.content_type)
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-photo", response_model=PhotoResponse)
async def generate_photo(request: PhotoRequest):
    image_url = generate_image(request.prompt, request.userId)
    if not image_url:
        raise HTTPException(status_code=500, detail="Image generation failed")
    return {"image_url": image_url}