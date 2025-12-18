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


@router.get(
    "/initiate",
    status_code=status.HTTP_200_OK,
    summary="Initiate Google OAuth flow",
    description="Generates OAuth state token and PKCE challenge, returns Google authorization URL"
)
async def initiate_oauth():
    """
    Generate OAuth state token and PKCE challenge, return Google authorization URL.
    Frontend should redirect user to the returned URL.
    Uses PKCE (Proof Key for Code Exchange) for enhanced security.
    """
    from authentication.config import GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI
    from urllib.parse import urlencode
    
    # Generate PKCE pair
    code_verifier, code_challenge = AuthService.generate_pkce_pair()
    
    # Generate signed state token (stateless - embeds code_verifier hash)
    state = AuthService.generate_signed_oauth_state(code_verifier=code_verifier)
    
    # Build Google OAuth authorization URL with PKCE
    params = {
        "client_id": GOOGLE_OAUTH_CLIENT_ID,
        "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256"
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    return {
        "authorization_url": auth_url,
        "state": state
    }


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
    response: Response,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Exchange the authorization `code` from Google for user information,
    find or create the user and issue application access/refresh tokens.
    Delegates the heavy lifting to `AuthService`.
    
    Validates the OAuth state parameter to prevent CSRF attacks.
    """
    try:
        # Validate OAuth state parameter (CSRF protection) - stateless verification
        # Extracts code_verifier from signed state token
        _, code_verifier = AuthService.validate_and_extract_oauth_state(state)
        
        # Exchange code for ID token (with PKCE code_verifier from signed state)
        id_token = await AuthService.exchange_code_for_id_token(code, code_verifier=code_verifier)
        
        # Authenticate with Google using the ID token
        user, access_token, refresh_token = await AuthService.authenticate_with_google(id_token, db)
        
        logger.info(f"User authenticated successfully: {user.email}")
        
        # Set refresh token in httpOnly cookie
        refresh_token_max_age = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # Convert days to seconds
        # Use secure=True only in production (HTTPS), allow False for local development
        is_production = os.getenv("ENVIRONMENT", "development") == "production"
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=refresh_token_max_age,
            httponly=True,
            secure=is_production,  # HTTPS only in production
            samesite="lax",  # CSRF protection
            path="/auth"  # Only send cookie to auth endpoints
        )
        
        # Return access token in response body (refresh token in cookie)
        return TokenResponse(
            access_token=access_token,
            refresh_token=None,  # Not in body, sent via cookie
            token_type="Bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # 15 minutes
        )
    except InvalidStateError as e:
        logger.warning(f"Invalid state parameter: {e}")
        raise HTTPException(status_code=400, detail="Invalid or expired OAuth state parameter")
    except (InvalidTokenError, TokenExpiredError) as e:
        logger.warning(f"Token error during OAuth callback: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except OAuthProviderError as e:
        logger.error(f"OAuth provider error: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail="OAuth provider error. Please try again.")
    except DatabaseError as e:
        logger.error(f"Database error during OAuth callback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
    except AuthenticationError as e:
        logger.warning(f"Authentication error: {e}")
        raise HTTPException(status_code=400, detail="Authentication failed")
    except Exception as e:
        logger.error(f"Unexpected error during OAuth callback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

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


@router.get(
    "/validate",
    response_model=TokenValidationResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate access token",
    description="Validates an access token and returns user information and role"
)
async def validate_token(request: Request) -> TokenValidationResponse:
    """
    Validate an access token from the Authorization header.
    Returns user information and role if token is valid.
    Used by frontend to check if user is still authenticated.
    """
    # Extract Authorization header
    authorization = request.headers.get("Authorization")
    if not authorization:
        return TokenValidationResponse(
            is_valid=False,
            user_id=None,
            role=None,
            message="Authorization header missing"
        )
    
    # Parse Bearer token
    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            return TokenValidationResponse(
                is_valid=False,
                user_id=None,
                role=None,
                message="Invalid authorization scheme. Expected 'Bearer'"
            )
    except ValueError:
        return TokenValidationResponse(
            is_valid=False,
            user_id=None,
            role=None,
            message="Invalid authorization header format"
        )
    
    # Validate token
    try:
        payload = AuthService.validate_access_token(token)
        user_id = int(payload["sub"])
        role = payload.get("role", "unknown")
        email = payload.get("email", "")
        
        logger.debug(f"Token validated successfully for user {user_id}")
        return TokenValidationResponse(
            is_valid=True,
            user_id=user_id,
            role=role,
            message=f"Token is valid for user {email}"
        )
    except TokenExpiredError:
        logger.debug("Token validation failed: token expired")
        return TokenValidationResponse(
            is_valid=False,
            user_id=None,
            role=None,
            message="Token has expired"
        )
    except InvalidTokenError as e:
        logger.debug(f"Token validation failed: {e}")
        return TokenValidationResponse(
            is_valid=False,
            user_id=None,
            role=None,
            message=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error during token validation: {e}", exc_info=True)
        return TokenValidationResponse(
            is_valid=False,
            user_id=None,
            role=None,
            message="Token validation failed"
        )



@router.post(
    "/role-change-check",
    status_code=status.HTTP_200_OK,
    summary="Check if user's role has changed",
    description="Checks if the user's role in the database differs from the role in their current access token"
)
async def check_role_change(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Check if user's role has changed since the access token was issued.
    Useful for propagating admin role changes within the access token lifetime (15 minutes).
    
    Returns:
        - role_changed: Boolean indicating if role has changed
        - current_role: Current role from database
        - token_role: Role from access token
    """
    # Extract Authorization header
    authorization = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Parse Bearer token
    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    # Validate token and extract role
    try:
        payload = AuthService.validate_access_token(token)
        user_id = int(payload["sub"])
        token_role = payload.get("role", "unknown")
        
        # Check if role has changed in database
        role_changed = AuthService.check_role_change(user_id, token_role, db)
        
        if role_changed:
            # Get current role from database
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
    except TokenExpiredError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error during role change check: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
