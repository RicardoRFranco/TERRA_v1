from typing import Optional, Dict, Any
from ..models.user import User
from .base import BaseRepository
from sqlalchemy.orm import Session
from app.core.security import get_password_hash

class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)
    
    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()
    
    def create(self, obj_in: Dict[str, Any]) -> User:
        # Hash password if it's in the input
        if "password" in obj_in:
            obj_in["hashed_password"] = get_password_hash(obj_in.pop("password"))
        
        return super().create(obj_in)
    
    def update(self, id: Any, obj_in: Dict[str, Any]) -> Optional[User]:
        # Hash password if it's in the input
        if "password" in obj_in:
            obj_in["hashed_password"] = get_password_hash(obj_in.pop("password"))
        
        return super().update(id, obj_in)