from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from models.user import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    name: str


class TokenData(BaseModel):
    email: str | None = None
    role: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str


class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    role: str = UserRole.USER.value
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str | None = None
    # Public signups never accept role input — always defaults safely to "user"


class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str | None = None
    role: UserRole = UserRole.USER
    is_active: bool = True


class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
