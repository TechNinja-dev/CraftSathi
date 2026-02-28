from pydantic import BaseModel

class PhotoRequest(BaseModel):
    prompt: str
    userId: str | None = None

class PhotoResponse(BaseModel):
    image_url: str

class MyStuffResponse(BaseModel):
    images: list