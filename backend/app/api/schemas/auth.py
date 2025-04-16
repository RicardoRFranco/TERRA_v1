from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from app.utils.validators import validate_password_strength

class UserRegister(BaseModel):
    """Schema for user registration data."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        """Validate that the password meets strength requirements."""
        if not validate_password_strength(v):
            raise ValueError("Password must contain at least 8 characters, including uppercase, lowercase, number and symbol")
        return v

class Token(BaseModel):
    """Schema for authentication tokens."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str

class TokenData(BaseModel):
    """Schema for token payload data."""
    username: Optional[str] = None
    
class RefreshToken(BaseModel):
    """Schema for refresh token requests."""
    refresh_token: str
    
class PasswordReset(BaseModel):
    """Schema for password reset requests."""
    email: EmailStr
    
class PasswordChange(BaseModel):
    """Schema for password change requests."""
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        """Validate that the new password meets strength requirements."""
        if not validate_password_strength(v):
            raise ValueError("Password must contain at least 8 characters, including uppercase, lowercase, number and symbol")
        return v