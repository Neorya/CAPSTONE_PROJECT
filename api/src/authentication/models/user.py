"""
SQLAlchemy model for the User entity.

Maps to capstone_app.users table.
"""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum
from database import Base


class UserRoleEnum(str, enum.Enum):
    """Enumeration of valid user roles."""
    student = "student"
    teacher = "teacher"
    admin = "admin"


class User(Base):
    """
    SQLAlchemy model for the 'users' table in capstone_app schema.
    
    Attributes:
        id: Primary key, auto-incremented integer.
        google_sub: Google's unique stable user identifier (unique, required).
        email: User's email address (unique, required, mutable).
        first_name: User's first name (required).
        last_name: User's last name (required).
        role: User's role (student, teacher, or admin). Defaults to 'student'.
        score: User's score for competition/gamification. Defaults to 0.
        profile_url: URL to user's profile picture (optional).
        created_at: Timestamp when the user was created.
        updated_at: Timestamp when the user was last updated.
    """
    __tablename__ = "users"
    __table_args__ = {'schema': 'capstone_app'}

    id = Column(Integer, primary_key=True)
    google_sub = Column(String(255), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(SQLEnum(UserRoleEnum), nullable=False, default=UserRoleEnum.student)
    score = Column(Integer, nullable=False, default=0)
    profile_url = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
