from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.session import get_db
from app.services.user_service import UserService
from app.core.security import (
    create_access_token, 
    create_refresh_token,
    verify_password, 
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.api.schemas.auth import Token, TokenData, UserRegister, RefreshToken
from app.utils.validators import validate_password_strength
from typing import Annotated
from jose import JWTError, jwt
from app.core.security import SECRET_KEY, ALGORITHM
from app.core.exceptions import CredentialsException

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user."""
    user_service = UserService(db)
    
    # Check if email already exists
    if user_service.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    if user_service.get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Validate password strength
    if not validate_password_strength(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password too weak. Must be at least 8 characters with a mix of letters, numbers, and symbols."
        )
    
    # Create new user
    user = user_service.create_user(user_data.dict())
    
    return {"message": "User registered successfully"}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Generate access and refresh tokens."""
    user_service = UserService(db)
    user = user_service.get_user_by_username(form_data.username)
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_token: RefreshToken, db: Session = Depends(get_db)):
    """Generate a new access token using a refresh token."""
    try:
        payload = jwt.decode(refresh_token.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if username is None or token_type != "refresh":
            raise CredentialsException()
            
        token_data = TokenData(username=username)
    except JWTError:
        raise CredentialsException()
    
    user_service = UserService(db)
    user = user_service.get_user_by_username(token_data.username)
    
    if user is None or not user.is_active:
        raise CredentialsException()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token.refresh_token,
        "token_type": "bearer"
    }

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    """Dependency to get the current authenticated user."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if username is None or token_type != "access":
            raise CredentialsException()
            
        token_data = TokenData(username=username)
    except JWTError:
        raise CredentialsException()
    
    user_service = UserService(db)
    user = user_service.get_user_by_username(token_data.username)
    
    if user is None:
        raise CredentialsException()
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user