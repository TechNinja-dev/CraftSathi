from pydantic import BaseModel, EmailStr

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