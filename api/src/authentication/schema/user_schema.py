"""
Pydantic schemas for User domain models.

Request/Response schemas for user-related API endpoints.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class UserRoleEnum(str):
    """Valid user role values."""
    student = "student"
    teacher = "teacher"
    admin = "admin"


class UserRead(BaseModel):
    """
    Schema for reading/returning user information.
    
    Attributes:
        id: User's unique identifier.
        google_sub: Google's stable user identifier.
        email: User's email address.
        first_name: User's first name.
        last_name: User's last name.
        role: User's role (student, teacher, admin).
        score: User's current score.
        profile_url: URL to user's profile picture.
        created_at: Timestamp when user was created.
        updated_at: Timestamp when user was last updated.
    """
    id: int = Field(..., description="User ID")
    google_sub: str = Field(..., description="Google unique identifier")
    email: str = Field(..., description="User email")
    first_name: str = Field(..., description="First name")
    last_name: str = Field(..., description="Last name")
    role: str = Field(..., description="User role (student/teacher/admin)")
    score: int = Field(..., description="User score")
    profile_url: Optional[str] = Field(None, description="Profile picture URL")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

    class Config:
        from_attributes = True


class UserCreateFromGoogle(BaseModel):
    """
    Schema for creating a user from Google OAuth token data.
    
    Attributes:
        google_sub: Google's stable user identifier.
        email: User's email from Google.
        first_name: User's first name from Google.
        last_name: User's last name from Google.
        profile_url: User's profile picture URL from Google.
    """
    google_sub: str = Field(..., description="Google unique identifier")
    email: str = Field(..., description="User email from Google")
    first_name: str = Field(..., description="First name from Google")
    last_name: str = Field(..., description="Last name from Google")
    profile_url: Optional[str] = Field(None, description="Profile picture URL from Google")


class UserUpdate(BaseModel):
    """
    Schema for updating user information.
    
    Attributes:
        email: User's email (optional).
        first_name: User's first name (optional).
        last_name: User's last name (optional).
        role: User's role (optional).
        score: User's score (optional).
        profile_url: User's profile picture URL (optional).
    """
    email: Optional[str] = Field(None, description="User email")
    first_name: Optional[str] = Field(None, description="First name")
    last_name: Optional[str] = Field(None, description="Last name")
    role: Optional[str] = Field(None, description="User role (student/teacher/admin)")
    score: Optional[int] = Field(None, description="User score")
    profile_url: Optional[str] = Field(None, description="Profile picture URL")


class UserBasic(BaseModel):
    """
    Minimal user information schema for embedding in other responses.
    
    Attributes:
        id: User's unique identifier.
        email: User's email address.
        first_name: User's first name.
        last_name: User's last name.
        role: User's role.
    """
    id: int = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    first_name: str = Field(..., description="First name")
    last_name: str = Field(..., description="Last name")
    role: str = Field(..., description="User role")

    class Config:
        from_attributes = True
