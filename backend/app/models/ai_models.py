from pydantic import BaseModel
from typing import Optional

class PhotoRequest(BaseModel):
    prompt: str
    userId: str | None = None

class VideoRequest(BaseModel):
    prompt: str
    userId: str | None = None

class VideoResponse(BaseModel):
    video_url: Optional[str] = None
    message: Optional[str] = None

class PhotoResponse(BaseModel):
    image_url: Optional[str] = None
    message: Optional[str] = None

class MyStuffResponse(BaseModel):
    images: list