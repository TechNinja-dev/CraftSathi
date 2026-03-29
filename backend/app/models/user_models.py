from pydantic import BaseModel, EmailStr
from typing import Optional
class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str

class GoogleAuthSchema(BaseModel):
    token: str
    

class SaveCaptionRequest(BaseModel):
    userId: str
    caption: str
    image_url: Optional[str] = None

class GetCaptionsRequest(BaseModel):
    userId: str
    limit: int = 50
    page: int = 1