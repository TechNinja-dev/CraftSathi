from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthSchema(BaseModel):
    token: str


class TokenResponse(BaseModel):
    token: str
    
class SaveCaptionRequest(BaseModel):
    userId: str
    caption: str
    image_url: Optional[str] = None
    image_data: Optional[str] = None

class GetCaptionsRequest(BaseModel):
    userId: str
    limit: int = 50
    page: int = 1

class AvatarUpdateRequest(BaseModel):
    user_id: str
    avatar: str

class ProfileEditRequest(BaseModel):
    user_id: str
    explore_name: str
    
class CreatePostRequest(BaseModel):
    user_id: str
    user_name: str
    explore_name: str
    image_url: str
    caption: str

class SavePostRequest(BaseModel):
    user_id: str
    post_id: str

# Private Dashboard Models
class PrivateAvatarUpdateRequest(BaseModel):
    userId: str
    avatar: str

class PrivateAvatarRemoveRequest(BaseModel):
    userId: str

class ProfileDataSchema(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    specialties: Optional[List[str]] = []
    instagram: Optional[str] = None
    youtube: Optional[str] = None
    website: Optional[str] = None
    experience: Optional[str] = None
    favoriteMaterials: Optional[List[str]] = []

class ProfileUpdateRequest(BaseModel):
    userId: str
    profile: ProfileDataSchema