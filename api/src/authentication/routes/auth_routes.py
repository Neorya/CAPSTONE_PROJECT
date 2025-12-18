"""
API route definitions for authentication domain.

Handles:
- Google OAuth callback endpoint
- Token refresh endpoint
- Token revocation endpoint (logout)
- Token validation endpoint (optional)
"""

import logging
import os
from datetime import timedelta
from authentication.config import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from authentication.schema.token_schema import TokenResponse, RefreshTokenRequest, TokenRevocationRequest, TokenValidationResponse
from authentication.schema.user_schema import UserRead
from authentication.services.auth_service import AuthService
from authentication.exceptions import (
    InvalidTokenError,
    InvalidStateError,
    TokenExpiredError,
    TokenRevokedError,
    UserNotFoundError,
    OAuthProviderError,
    DatabaseError,
    AuthenticationError
)
from database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


# Initialize Authlib
from authlib.integrations.starlette_client import OAuth
from authentication.config import (
    GOOGLE_OAUTH_CLIENT_ID, 
    GOOGLE_OAUTH_CLIENT_SECRET, 
    GOOGLE_OAUTH_REDIRECT_URI,
    GOOGLE_OAUTH_DISCOVERY_URL
)

oauth = OAuth()
oauth.register(
    name='google',
    client_id=GOOGLE_OAUTH_CLIENT_ID,
    client_secret=GOOGLE_OAUTH_CLIENT_SECRET,
    server_metadata_url=GOOGLE_OAUTH_DISCOVERY_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)


@router.get(
    "/initiate",
    status_code=status.HTTP_200_OK,
    summary="Initiate Google OAuth flow",
    description="Redirects user to Google for authentication"
)
async def initiate_oauth(request: Request):
    """
    Initiate Google OAuth flow.
    Redirects user to Google's authorization page.
    """
    redirect_uri = GOOGLE_OAUTH_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


from fastapi.responses import JSONResponse, RedirectResponse

SERVER_URL = os.getenv("SERVER_URL", "http://localhost:3000")

@router.get(
    "/callback",
    status_code=status.HTTP_200_OK,
    summary="Google OAuth callback",    
    description="Handles Google OAuth callback and issues tokens",
)
async def google_oauth_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Exchange the authorization code from Google for user information,
    find or create the user, issue application access/refresh tokens,
    and redirect to frontend.
    """
    try:
        # Authlib handles the exchange of code for token and user info parsing
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
             user_info = await oauth.google.userinfo(token=token)

        # Authenticate with Google user info
        user, access_token, refresh_token = await AuthService.authenticate_with_google(dict(user_info), db)
        
        logger.info(f"User authenticated successfully: {user.email}")
        
        # Prepare redirect to frontend
        # Pass access_token in URL fragment or query param so frontend can read it
        # Fragment is safer as it's not sent to server on reload, but query param is standard for this flow
        redirect_url = f"{SERVER_URL}/home?access_token={access_token}"
        response = RedirectResponse(url=redirect_url)

        # Set refresh token in httpOnly cookie
        refresh_token_max_age = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # Convert days to seconds
        is_production = os.getenv("ENVIRONMENT", "development") == "production"
        
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=refresh_token_max_age,
            httponly=True,
            secure=is_production,
            samesite="lax",
            path="/auth"
        )
        
        return response

    except OAuthProviderError as e:
        logger.error(f"OAuth provider error: {e}", exc_info=True)
        # Redirect to frontend login with error
        return RedirectResponse(url=f"{SERVER_URL}/?error=oauth_error")
    except DatabaseError as e:
        logger.error(f"Database error during OAuth callback: {e}", exc_info=True)
        return RedirectResponse(url=f"{SERVER_URL}/?error=server_error")
    except AuthenticationError as e:
        logger.warning(f"Authentication error: {e}")
        return RedirectResponse(url=f"{SERVER_URL}/?error=auth_failed")
    except Exception as e:
        logger.error(f"Unexpected error during OAuth callback: {e}", exc_info=True)
        return RedirectResponse(url=f"{SERVER_URL}/?error=unexpected_error")

@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",    
    description="Issues a new access token using a valid refresh token from cookie",
)
async def refresh_access_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Refresh the access token using a valid refresh token from httpOnly cookie.
    Implements refresh token rotation.
    """
    # Read refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not found in cookie")
    
    try:
        # Refresh token rotation: old token revoked, new token issued
        new_access_token, new_refresh_token = AuthService.refresh_access_token(refresh_token, db)
        
        logger.info("Access token refreshed successfully")
        
        # Set new refresh token in cookie (rotation)
        refresh_token_max_age = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        is_production = os.getenv("ENVIRONMENT", "development") == "production"
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            max_age=refresh_token_max_age,
            httponly=True,
            secure=is_production,
            samesite="lax",
            path="/auth"
        )
        
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=None,  # Not in body, sent via cookie
            token_type="Bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # 15 minutes
        )
    except (InvalidTokenError, TokenExpiredError, TokenRevokedError) as e:
        logger.warning(f"Invalid refresh token: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    except UserNotFoundError as e:
        logger.error(f"User not found during token refresh: {e}")
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    except DatabaseError as e:
        logger.error(f"Database error during token refresh: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
    except Exception as e:
        logger.error(f"Unexpected error during token refresh: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Revoke refresh token (logout)",    
    description="Revokes the refresh token from cookie to log out the user",
)
async def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Revoke the refresh token from cookie to log out the user.
    Clears the refresh token cookie.
    """
    # Read refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    
    if refresh_token:
        try:
            revoked = AuthService.revoke_refresh_token(refresh_token, db)
            if revoked:
                logger.info("Refresh token revoked successfully")
            else:
                # Token not found - idempotent success (already logged out or invalid token)
                logger.debug("Token not found during logout (idempotent)")
        except DatabaseError as e:
            logger.error(f"Database error during logout: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")
        except Exception as e:
            logger.error(f"Unexpected error during logout: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")
    
    # Clear refresh token cookie regardless of revocation result
    response.delete_cookie(
        key="refresh_token",
        path="/auth",
        samesite="lax"
    )
    
    return {"message": "Successfully logged out"}


from fastapi.security import OAuth2PasswordBearer
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Dependency to validate access token and return user info.
    """
    try:
        payload = AuthService.validate_access_token(token)
        return payload
    except (InvalidTokenError, TokenExpiredError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get(
    "/validate",
    response_model=TokenValidationResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate access token",
    description="Validates an access token and returns user information and role"
)
async def validate_token(
    current_user: Annotated[dict, Depends(get_current_user)]
) -> TokenValidationResponse:
    """
    Validate an access token.
    Uses get_current_user dependency which handles token extraction and validation.
    """
    user_id = int(current_user["sub"])
    role = current_user.get("role", "unknown")
    email = current_user.get("email", "")
    
    return TokenValidationResponse(
        is_valid=True,
        user_id=user_id,
        role=role,
        message=f"Token is valid for user {email}"
    )


@router.post(
    "/role-change-check",
    status_code=status.HTTP_200_OK,
    summary="Check if user's role has changed",
    description="Checks if the user's role in the database differs from the role in their current access token"
)
async def check_role_change(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """
    Check if user's role has changed since the access token was issued.
    """
    user_id = int(current_user["sub"])
    token_role = current_user.get("role", "unknown")
    
    try:
        # Check if role has changed in database
        role_changed = AuthService.check_role_change(user_id, token_role, db)
        
        if role_changed:
            from authentication.repositories.user_repository import UserRepository
            user = UserRepository.get_by_id(db, user_id)
            current_role = user.role.value if user else token_role
            
            logger.info(f"Role change detected for user {user_id}: {token_role} -> {current_role}")
            return {
                "role_changed": True,
                "current_role": current_role,
                "token_role": token_role,
                "message": f"Role has changed from {token_role} to {current_role}. Please refresh your token."
            }
        else:
            return {
                "role_changed": False,
                "current_role": token_role,
                "token_role": token_role,
                "message": "Role has not changed"
            }
    except Exception as e:
        logger.error(f"Unexpected error during role change check: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
