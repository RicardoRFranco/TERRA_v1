from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.repositories.user import UserRepository
from app.db.models.user import User

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)
    
    def get_user(self, user_id: int) -> Optional[User]:
        return self.repository.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.repository.get_by_email(email)
    
    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.repository.get_all(skip=skip, limit=limit)
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        return self.repository.get_by_username(username)
    
    def create_user(self, user_data: Dict[str, Any]) -> User:
        return self.repository.create(user_data)
    
    def update_user(self, user_id: int, user_data: Dict[str, Any]) -> Optional[User]:
        return self.repository.update(user_id, user_data)
    
    def delete_user(self, user_id: int) -> bool:
        return self.repository.delete(user_id)