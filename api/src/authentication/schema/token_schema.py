"""
Pydantic schemas for Token domain models.

Request/Response schemas for token-related API endpoints and payloads.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TokenResponse(BaseModel):
    """
    Schema for token response containing access token.
    Refresh token is sent via httpOnly cookie for security.
    
    Attributes:
        access_token: Short-lived JWT access token (15 minutes).
        refresh_token: Optional - only included for backward compatibility (prefer cookie).
        token_type: Token type (always "Bearer").
        expires_in: Access token expiration time in seconds.
    
    Token durations:
        - access_token: 15 minutes (900 seconds)
        - refresh_token: 7 days (configurable in authentication/config.py, sent via cookie)
    """
    access_token: str = Field(..., description="Short-lived access token (JWT, 15 minutes)")
    refresh_token: Optional[str] = Field(None, description="Long-lived refresh token (deprecated - use cookie)")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiration in seconds (900)")


class RefreshTokenRequest(BaseModel):
    """
    Schema for refresh token request.
    
    Attributes:
        refresh_token: The refresh token to use for obtaining a new access token.
    """
    refresh_token: str = Field(..., description="Refresh token")


class AccessTokenPayload(BaseModel):
    """
    Schema for access token JWT payload (claims).
    
    Uses 'sub' claim (standard JWT claim) for user ID.
    
    Attributes:
        sub: The user's ID (standard JWT subject claim).
        email: The user's email.
        role: The user's role (student/teacher/admin).
        exp: Token expiration time (Unix timestamp).
        iat: Token issued-at time (Unix timestamp).
    """
    sub: str = Field(..., description="User ID (subject claim)")
    email: str = Field(..., description="User email")
    role: str = Field(..., description="User role")
    exp: int = Field(..., description="Expiration time (Unix timestamp)")
    iat: Optional[int] = Field(None, description="Issued-at time (Unix timestamp)")
    
    # Alias for backward compatibility if needed
    @property
    def user_id(self) -> int:
        """Get user_id from sub claim."""
        return int(self.sub)


class RefreshTokenPayload(BaseModel):
    """
    Schema for refresh token database payload.
    
    Attributes:
        id: Refresh token ID.
        user_id: Associated user ID.
        token_hash: Hashed refresh token.
        expires_at: Expiration timestamp.
        revoked_at: Revocation timestamp (null if not revoked).
        created_at: Creation timestamp.
    """
    id: int = Field(..., description="Refresh token ID")
    user_id: int = Field(..., description="Associated user ID")
    token_hash: str = Field(..., description="Hashed token")
    expires_at: datetime = Field(..., description="Expiration timestamp")
    revoked_at: Optional[datetime] = Field(None, description="Revocation timestamp")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        from_attributes = True


class TokenRevocationRequest(BaseModel):
    """
    Schema for token revocation request.
    
    Attributes:
        refresh_token: The refresh token to revoke.
    """
    refresh_token: str = Field(..., description="Refresh token to revoke")


class TokenValidationResponse(BaseModel):
    """
    Schema for token validation response.
    
    Attributes:
        is_valid: Whether the token is valid.
        user_id: Associated user ID (if valid).
        role: User's role (if valid).
        message: Validation message or error reason.
    """
    is_valid: bool = Field(..., description="Whether token is valid")
    user_id: Optional[int] = Field(None, description="User ID if valid")
    role: Optional[str] = Field(None, description="User role if valid")
    message: str = Field(..., description="Validation message or error")
