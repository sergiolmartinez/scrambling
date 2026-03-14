from datetime import datetime

from pydantic import BaseModel, Field


class AuthSignUpRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    display_name: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class AuthSignInRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class AuthUserRead(BaseModel):
    id: int
    email: str
    display_name: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserMeUpdateRequest(BaseModel):
    display_name: str = Field(min_length=1, max_length=120)
