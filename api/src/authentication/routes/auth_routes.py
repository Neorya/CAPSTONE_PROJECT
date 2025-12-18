"""
API route definitions for authentication domain.

Handles:
- Google OAuth callback endpoint
- Token refresh endpoint
- Token revocation endpoint (logout)
- Token validation endpoint (optional)
"""

# TODO: Import FastAPI router and dependencies
from api.src.authentication.config import ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from authentication.schema.token_schema import TokenResponse, RefreshTokenRequest, TokenRevocationRequest
from authentication.schema.user_schema import UserRead
from authentication.services.auth_service import AuthService
from database import get_db

# TODO: Create FastAPI router instance
router = APIRouter(prefix="/auth", tags=["authentication"])


# TODO: Implement GET /auth/callback?code=...&state=...
# - Receive authorization code from Google OAuth redirect
# - Verify the authorization code with Google
# - Extract user information from Google ID token
# - Find or create user in database
# - Issue application access token and refresh token
# - Return tokens to frontend
@router.get(
    "/callback",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Google OAuth callback",    
    description="Handles Google OAuth callback and issues tokens",
)
async def google_oauth_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Exchange the authorization `code` from Google for user information,
    find or create the user and issue application access/refresh tokens.
    Delegates the heavy lifting to `AuthService`.
    """
    try:
        # Exchange code for ID token
        id_token = await AuthService.exchange_code_for_id_token(code)
        
        # Authenticate with Google using the ID token
        user, access_token, refresh_token = await AuthService.authenticate_with_google(id_token, db)
        
        # Return tokens
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # 15 minutes
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth callback failed: {str(e)}")

# TODO: Implement POST /auth/refresh
# - Accept refresh token in request body
# - Validate refresh token (check if valid, not revoked, not expired)
# - Look up user from refresh token
# - Issue new access token with current user role
# - Return new access token to client
@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",    
    description="Issues a new access token using a valid refresh token",
)
async def refresh_access_token(
    refresh_token_request: RefreshTokenRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Refresh the access token using a valid refresh token.
    """
    if not refresh_token_request.refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token is required")
    try:
        
        new_access_token = AuthService.refresh_access_token(refresh_token_request.refresh_token, db)
        
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=refresh_token_request.refresh_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # 15 minutes
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Token refresh failed: {str(e)}")


# TODO: Implement POST /auth/logout (revoke token)
# - Accept refresh token in request body
# - Revoke the refresh token in database (set revoked_at)
# - Optionally revoke all tokens for the user
# - Return success response
@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Revoke refresh token (logout)",    
    description="Revokes the provided refresh token to log out the user",
)
async def logout(
    refresh_token_request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Revoke the provided refresh token to log out the user.
    """
    if not refresh_token_request.refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token is required")

    try:
        AuthService.revoke_refresh_token(refresh_token_request.refresh_token, db)
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Logout failed: {str(e)}")


# TODO: (Optional) Implement GET /auth/validate
# - Validate access token
# - Return user information and role
# - Used by frontend to check if user is still authenticated



# TODO: (Optional) Implement POST /auth/role-change-check
# - For checking if user's role has changed since last token refresh
# - Useful for propagating admin role changes within 15 minutes
