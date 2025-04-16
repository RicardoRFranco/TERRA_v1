"""
Validation utilities for the TERRA App.
"""

import re
from typing import Optional


def is_valid_email(email: str) -> bool:
    """
    Validate if a string is a properly formatted email address.
    
    Args:
        email: The email string to validate
        
    Returns:
        bool: True if the email is valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password_strength(password: str) -> bool:
    """
    Validate if a password meets the minimum security requirements.
    
    Requirements:
    - At least 8 characters long
    - Contains at least one digit
    - Contains at least one lowercase letter
    - Contains at least one uppercase letter
    - Contains at least one special character
    
    Args:
        password: The password to validate
        
    Returns:
        bool: True if the password is strong enough, False otherwise
    """
    # Length check
    if len(password) < 8:
        return False
    
    # Check for at least one digit
    if not re.search(r'\d', password):
        return False
    
    # Check for at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False
    
    # Check for at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False
    
    # Check for at least one special character
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    
    return True


def validate_coordinates(latitude: float, longitude: float) -> bool:
    """
    Validate if latitude and longitude coordinates are within valid ranges.
    
    Args:
        latitude: The latitude coordinate (-90 to 90)
        longitude: The longitude coordinate (-180 to 180)
        
    Returns:
        bool: True if coordinates are valid, False otherwise
    """
    return -90 <= latitude <= 90 and -180 <= longitude <= 180


def sanitize_string(input_string: Optional[str]) -> Optional[str]:
    """
    Sanitize an input string by removing potentially harmful characters.
    
    Args:
        input_string: The string to sanitize
        
    Returns:
        str: The sanitized string or None if input was None
    """
    if input_string is None:
        return None
    
    # Remove HTML/JavaScript tags
    sanitized = re.sub(r'<[^>]*>', '', input_string)
    
    # Replace multiple spaces with a single space
    sanitized = re.sub(r'\s+', ' ', sanitized)
    
    # Trim whitespace
    sanitized = sanitized.strip()
    
    return sanitized