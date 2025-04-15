from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.db.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    full_name = Column(String, nullable=True)
    
    # Define relationship as a string reference to avoid circular imports
    routes = relationship("Route", back_populates="user", cascade="all, delete-orphan")