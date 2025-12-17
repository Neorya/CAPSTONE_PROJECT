"""
SQLAlchemy model for the RefreshToken entity.

Maps to capstone_app.refresh_tokens table.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base


class RefreshToken(Base):
    """
    SQLAlchemy model for the 'refresh_tokens' table in capstone_app schema.
    
    Refresh tokens enable long-lived sessions without storing long-lived access tokens.
    They can be revoked immediately for logout or security purposes.
    
    Attributes:
        id: Primary key, auto-incremented integer.
        user_id: Foreign key reference to users.id (cascade delete).
        token_hash: Hashed refresh token (unique, required). Never store raw tokens.
        expires_at: Expiration timestamp for the refresh token.
        revoked_at: Timestamp when the token was revoked (null if not revoked).
        created_at: Timestamp when the token was created.
    """
    __tablename__ = "refresh_tokens"
    __table_args__ = {'schema': 'capstone_app'}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('capstone_app.users.id', ondelete='CASCADE'), nullable=False)
    token_hash = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self) -> str:
        status = "revoked" if self.revoked_at else "active"
        return f"<RefreshToken(id={self.id}, user_id={self.user_id}, status={status})>"

    def is_valid(self) -> bool:
        """
        Check if the refresh token is still valid.
        
        A token is valid if:
        - It has not been revoked
        - It has not expired
        
        Returns:
            bool: True if token is valid, False otherwise.
        """
        if self.revoked_at is not None:
            return False
        if self.expires_at < datetime.utcnow():
            return False
        return True
