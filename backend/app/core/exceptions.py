"""
Centralized exception handling for the TERRA App.
This module contains custom exceptions used throughout the application.
"""

from fastapi import HTTPException, status

class BaseAppException(HTTPException):
    """Base class for all application exceptions."""
    def __init__(self, status_code: int, detail: str, headers: dict = None):
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class CredentialsException(BaseAppException):
    """Exception raised when user credentials are invalid."""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(BaseAppException):
    """Exception raised when a user doesn't have permission to access a resource."""
    def __init__(self, detail: str = "You don't have permission to access this resource"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


class NotFoundException(BaseAppException):
    """Exception raised when a requested resource is not found."""
    def __init__(self, resource_type: str, resource_id: str = None):
        detail = f"{resource_type} not found"
        if resource_id:
            detail = f"{resource_type} with id {resource_id} not found"
            
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
        )


class ValidationException(BaseAppException):
    """Exception raised when validation fails."""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class DuplicateResourceException(BaseAppException):
    """Exception raised when trying to create a resource that already exists."""
    def __init__(self, resource_type: str, field: str, value: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{resource_type} with {field} '{value}' already exists",
        )