from datetime import datetime

def format_datetime(dt: datetime) -> str:
    """Format datetime to ISO format."""
    return dt.isoformat() if dt else ""

def is_valid_email(email: str) -> bool:
    """Simple email validation."""
    import re
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))