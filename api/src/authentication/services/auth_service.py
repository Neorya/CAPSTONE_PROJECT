import os
import hashlib
import secrets
import base64
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, Dict
import jwt
import httpx
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from authentication.models.user import User, UserRoleEnum
from authentication.models.refresh_token import RefreshToken
from authentication.repositories.user_repository import UserRepository
from authentication.repositories.refresh_token_repository import RefreshTokenRepository
from authentication.schema.user_schema import UserCreateFromGoogle
from authentication.schema.token_schema import TokenResponse, AccessTokenPayload
from authentication.exceptions import (
    InvalidTokenError,
    InvalidStateError,
    TokenExpiredError,
    TokenRevokedError,
    UserNotFoundError,
    OAuthProviderError,
    DatabaseError,
    ConfigurationError
)

logger = logging.getLogger(__name__)

"""
Business logic layer for authentication domain.

Handles:
- Token generation (access and refresh tokens)
- Token validation and verification
- Google OAuth token verification
- User authentication workflow
"""

from authentication.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_TIMEDELTA,
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    TOKEN_HASH_ALGORITHM,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI,
    GOOGLE_OAUTH_DISCOVERY_URL,
)


class AuthService:
    """
    Service class for authentication-related operations.
    
    Methods:
    - authenticate_with_google
    - refresh_access_token
    - validate_access_token
    - revoke_refresh_token
    - revoke_all_user_tokens
    - issue_access_token
    - issue_refresh_token
    - hash_token
    - generate_random_token
    """



    # ============================================================================
    # Google Token Verification with JWKS Caching
    # ============================================================================
    _jwks_cache: Optional[Dict] = None
    _jwks_cache_expires_at: Optional[datetime] = None
    _JWKS_CACHE_TTL_SECONDS = 3600  # Cache JWKS for 1 hour

    @staticmethod
    async def _fetch_jwks() -> Dict:
        """
        Fetch Google's JWKS (JSON Web Key Set) with caching.
        Caches JWKS for 1 hour to reduce external API calls.
        
        Returns:
            JWKS dictionary
        """
        # Check cache
        if (AuthService._jwks_cache is not None and 
            AuthService._jwks_cache_expires_at is not None and
            AuthService._jwks_cache_expires_at > datetime.utcnow()):
            return AuthService._jwks_cache
        
        # Fetch discovery document
        timeout = httpx.Timeout(10.0, connect=5.0)  # 10s total, 5s connect
        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                discovery_resp = await client.get(GOOGLE_OAUTH_DISCOVERY_URL)
                discovery_resp.raise_for_status()
                discovery_data = discovery_resp.json()
                jwks_uri = discovery_data["jwks_uri"]
                
                # Fetch JWKS
                jwks_resp = await client.get(jwks_uri)
                jwks_resp.raise_for_status()
                jwks = jwks_resp.json()
                
                # Cache JWKS
                AuthService._jwks_cache = jwks
                AuthService._jwks_cache_expires_at = datetime.utcnow() + timedelta(seconds=AuthService._JWKS_CACHE_TTL_SECONDS)
                
                return jwks
            except httpx.TimeoutException as e:
                logger.error("Timeout while fetching Google JWKS", exc_info=True)
                raise OAuthProviderError("Timeout while fetching Google JWKS") from e
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error fetching Google JWKS: {e.response.status_code}", exc_info=True)
                raise OAuthProviderError(f"HTTP error fetching Google JWKS: {e.response.status_code}") from e
            except Exception as e:
                logger.error("Error fetching Google JWKS", exc_info=True)
                raise OAuthProviderError(f"Error fetching Google JWKS: {str(e)}") from e

    @staticmethod
    async def verify_google_token(token: str) -> dict:
        """
        Verify Google ID token with improved security checks.
        
        Validates:
        - Token signature using Google's public keys (with caching)
        - Token expiration
        - Audience (client_id)
        - Issuer (supports multiple variants)
        - Email verification status
        
        Args:
            token: Google ID token string
            
        Returns:
            Decoded token payload
            
        Raises:
            Exception: If token is invalid or verification fails
        """
        # Fetch JWKS (with caching)
        jwks = await AuthService._fetch_jwks()

        # Decode and verify token
        try:
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header["kid"]
            key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
            if key is None:
                logger.warning(f"Public key not found for token kid: {kid}")
                raise InvalidTokenError("Public key not found for token")

            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
            
            # Support multiple issuer variants
            # Google can use either "https://accounts.google.com" or "accounts.google.com"
            valid_issuers = [
                "https://accounts.google.com",
                "accounts.google.com"
            ]
            
            payload = None
            last_error = None
            
            # Try each issuer variant
            for issuer in valid_issuers:
                try:
                    payload = jwt.decode(
                        token,
                        public_key,
                        algorithms=["RS256"],
                        audience=GOOGLE_OAUTH_CLIENT_ID,
                        issuer=issuer,
                        options={"verify_exp": True, "verify_aud": True, "verify_iss": True}
                    )
                    break  # Success, exit loop
                except jwt.InvalidIssuerError as e:
                    last_error = e
                    continue  # Try next issuer
                except Exception as e:
                    last_error = e
                    break  # Other error, don't try other issuers
            
            if payload is None:
                logger.warning(f"Token verification failed: {last_error}")
                raise InvalidTokenError("Token verification failed")
            
            # Validate email_verified claim (if email claim is present)
            if "email" in payload:
                email_verified = payload.get("email_verified", False)
                if not email_verified:
                    logger.warning(f"Email not verified for user: {payload.get('email')}")
                    raise InvalidTokenError("Email address not verified by Google")
            
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.debug("Google token has expired")
            raise TokenExpiredError("Google token has expired")
        except jwt.InvalidAudienceError:
            logger.warning("Invalid token audience")
            raise InvalidTokenError("Invalid token audience")
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid Google token: {e}")
            raise InvalidTokenError(f"Invalid Google token: {str(e)}")
        except (InvalidTokenError, TokenExpiredError):
            raise  # Re-raise our custom exceptions
        except Exception as e:
            logger.error("Unexpected error verifying Google token", exc_info=True)
            raise InvalidTokenError(f"Token verification error: {str(e)}") from e

    @staticmethod
    async def exchange_code_for_id_token(code: str, code_verifier: Optional[str] = None) -> str:
        """
        Exchange authorization code for ID token from Google.
        Supports PKCE flow if code_verifier is provided.
        
        Args:
            code: Authorization code from Google
            code_verifier: PKCE code_verifier (optional, for PKCE flow)
            
        Returns:
            Google ID token string
        """
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
        }
        
        # Add PKCE code_verifier if provided
        if code_verifier:
            data["code_verifier"] = code_verifier
        
        timeout = httpx.Timeout(10.0, connect=5.0)
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                resp = await client.post(token_url, data=data)
                resp.raise_for_status()
                token_data = resp.json()
            id_token = token_data.get("id_token")
            if not id_token:
                logger.error("No id_token in response from Google")
                raise OAuthProviderError("No id_token in response from Google")
            return id_token
        except httpx.TimeoutException as e:
            logger.error("Timeout exchanging code for token", exc_info=True)
            raise OAuthProviderError("Timeout exchanging authorization code with Google") from e
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error exchanging code: {e.response.status_code}", exc_info=True)
            raise OAuthProviderError(f"Failed to exchange authorization code: {e.response.status_code}") from e
        except Exception as e:
            logger.error("Error exchanging code for token", exc_info=True)
            raise OAuthProviderError(f"Error exchanging authorization code: {str(e)}") from e
    

    @staticmethod
    def issue_access_token(user: User, expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES * 60) -> str:
        expire = datetime.utcnow() + timedelta(seconds=expires_in)
        # Convert role enum to string value for JWT payload
        role_value = user.role.value if hasattr(user.role, 'value') else str(user.role)
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": role_value,
            "exp": expire,
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return token


    @staticmethod
    def issue_refresh_token(user_id: int, db: Session) -> Tuple[str, str]:
        """
        Issue a new refresh token using configured expiration from config.py.
        Uses REFRESH_TOKEN_EXPIRE_TIMEDELTA for consistency.
        """
        raw_token = AuthService.generate_random_token()
        hashed_token = AuthService.hash_token(raw_token)
        expires_at = datetime.utcnow() + REFRESH_TOKEN_EXPIRE_TIMEDELTA

        # Store hashed token in database
        RefreshTokenRepository.create(
            db=db,
            user_id=user_id,
            token_hash=hashed_token,
            expires_at=expires_at
        )

        return raw_token, hashed_token


    @staticmethod
    async def authenticate_with_google(google_token: str, db: Session) -> Tuple[User, str, str]:
        # Verify Google token and extract user info
        google_payload = await AuthService.verify_google_token(google_token)
        google_sub = google_payload["sub"]
        email = google_payload["email"]
        fullname = google_payload.get("name", "")
        picture = google_payload.get("picture", "")
        name_parts = fullname.split(" ", 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ""
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Find or create user in database
        user = UserRepository.get_by_google_sub(db, google_sub)
        if not user:
            user_data = UserCreateFromGoogle(
                google_sub=google_sub,
                email=email,
                first_name=first_name,
                last_name=last_name,
                profile_url=picture,
                role="student"  # Default role
            )
            user = UserRepository.create(db, user_data.dict())

        # Issue tokens
        access_token = AuthService.issue_access_token(user)
        refresh_token, _ = AuthService.issue_refresh_token(user.id, db)

        return user, access_token, refresh_token


    @staticmethod
    def refresh_access_token(refresh_token: str, db: Session) -> Tuple[str, str]:
        """
        Refresh access token using a valid refresh token.
        Implements refresh token rotation: revokes old token and issues new one.
        
        Args:
            refresh_token: The refresh token to use
            db: Database session
            
        Returns:
            Tuple of (new_access_token, new_refresh_token)
            
        Raises:
            Exception: If refresh token is invalid, expired, or already revoked
        """
        # Hash the provided refresh token
        hashed_token = AuthService.hash_token(refresh_token)

        # Validate the refresh token
        try:
            token_record = RefreshTokenRepository.get_by_token_hash(db, hashed_token)
            if not token_record:
                logger.warning("Refresh token not found")
                raise InvalidTokenError("Invalid refresh token")
            
            if not token_record.is_valid():
                if token_record.revoked_at:
                    logger.warning("Refresh token has been revoked")
                    raise TokenRevokedError("Refresh token has been revoked")
                else:
                    logger.warning("Refresh token has expired")
                    raise TokenExpiredError("Refresh token has expired")

            # Look up user from refresh token
            user = UserRepository.get_by_id(db, token_record.user_id)
            if not user:
                logger.error(f"User not found for refresh token: {token_record.user_id}")
                raise UserNotFoundError("User not found")
            
            # Revoke the old refresh token (token rotation)
            token_record.revoked_at = datetime.utcnow()
            db.commit()
        except (InvalidTokenError, TokenRevokedError, TokenExpiredError, UserNotFoundError):
            raise  # Re-raise our custom exceptions
        except SQLAlchemyError as e:
            logger.error("Database error during token refresh", exc_info=True)
            db.rollback()
            raise DatabaseError("Database error during token refresh") from e
        
        # Issue new access token with current role
        new_access_token = AuthService.issue_access_token(user)
        
        # Issue new refresh token (token rotation)
        new_refresh_token, _ = AuthService.issue_refresh_token(user.id, db)

        return new_access_token, new_refresh_token


    @staticmethod
    def validate_access_token(access_token: str) -> dict:
        """
        Validate access token JWT.
        Relies on PyJWT's built-in expiration verification (verify_exp=True by default).
        
        Args:
            access_token: JWT access token string
            
        Returns:
            Decoded token payload
            
        Raises:
            Exception: If token is invalid or expired
        """
        try:
            # PyJWT automatically verifies expiration (exp claim) and uses UTC internally
            # No need for manual expiration check
            payload = jwt.decode(
                access_token, 
                JWT_SECRET_KEY, 
                algorithms=[JWT_ALGORITHM],
                options={"verify_exp": True, "verify_signature": True}
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.debug("Access token has expired")
            raise TokenExpiredError("Access token has expired")
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid access token: {e}")
            raise InvalidTokenError(f"Invalid access token: {str(e)}")


    @staticmethod
    def revoke_refresh_token(refresh_token_raw: str, db: Session) -> bool:
        """
        Revoke a refresh token.
        
        Args:
            refresh_token_raw: The raw refresh token to revoke
            db: Database session
            
        Returns:
            True if token was revoked, False if token not found
            
        Raises:
            DatabaseError: If database operation fails
        """
        try:
            hashed_token = AuthService.hash_token(refresh_token_raw)
            token_record = RefreshTokenRepository.get_by_token_hash(db, hashed_token)
            if not token_record:
                return False
            token_record.revoked_at = datetime.utcnow()
            db.commit()
            return True
        except SQLAlchemyError as e:
            logger.error("Database error revoking refresh token", exc_info=True)
            db.rollback()
            raise DatabaseError("Database error revoking refresh token") from e


    @staticmethod
    def revoke_all_user_tokens(user_id: int, db: Session) -> int:
        revoked_count = RefreshTokenRepository.revoke_all_for_user(db, user_id)
        return revoked_count


    @staticmethod
    def hash_token(token: str) -> str:
        hasher = hashlib.new(TOKEN_HASH_ALGORITHM)
        hasher.update(token.encode('utf-8'))
        return hasher.hexdigest()
    


    @staticmethod
    def generate_random_token(length: int = 64) -> str:
        return secrets.token_urlsafe(length)


    @staticmethod
    def check_role_change(user_id: int, old_role: str, db: Session) -> bool:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise Exception("User not found")
        return user.role != old_role

    # ============================================================================
    # OAuth State Management (CSRF Protection + PKCE) - Signed Stateless
    # ============================================================================
    # Uses signed JWT tokens for stateless state management
    # Works across multiple workers/containers without shared storage
    # Embeds expiration, nonce, and PKCE code_verifier in signed token

    @staticmethod
    def generate_signed_oauth_state(code_verifier: Optional[str] = None, expires_in_minutes: int = 10) -> str:
        """
        Generate a signed OAuth state token (JWT) containing expiration, nonce, and PKCE code_verifier.
        Stateless - no server-side storage required.
        
        Args:
            code_verifier: PKCE code_verifier (optional, for PKCE flow)
            expires_in_minutes: Minutes until expiration (default 10)
            
        Returns:
            Signed state token (JWT string)
        """
        # Generate random nonce for additional security
        nonce = secrets.token_urlsafe(16)
        
        # Calculate expiration
        expires_at = datetime.utcnow() + timedelta(minutes=expires_in_minutes)
        
        # Create payload with all necessary information
        payload = {
            "nonce": nonce,
            "exp": int(expires_at.timestamp()),
            "iat": int(datetime.utcnow().timestamp()),
            "type": "oauth_state"
        }
        
        # Include code_verifier if provided (for PKCE)
        # Signed JWT protects the code_verifier from tampering
        if code_verifier:
            payload["code_verifier"] = code_verifier
        
        # Sign the state token using JWT_SECRET_KEY
        state_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return state_token

    @staticmethod
    def validate_and_extract_oauth_state(state: str, code_verifier: Optional[str] = None) -> Tuple[bool, Optional[str]]:
        """
        Validate a signed OAuth state token and extract PKCE code_verifier if present.
        Stateless - verifies signature and expiration without server-side storage.
        
        Args:
            state: The signed state token to validate
            code_verifier: PKCE code_verifier (optional, for verification)
            
        Returns:
            Tuple of (is_valid, code_verifier) - code_verifier returned if provided during validation
            
        Raises:
            InvalidStateError: If state is invalid, expired, or signature verification fails
        """
        if not state:
            logger.warning("State parameter is missing")
            raise InvalidStateError("State parameter is required")
        
        try:
            # Verify signature and decode payload
            payload = jwt.decode(
                state,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM],
                options={"verify_exp": True, "verify_signature": True}
            )
            
            # Verify token type
            if payload.get("type") != "oauth_state":
                logger.warning("Invalid state token type")
                raise InvalidStateError("Invalid state token type")
            
            # Extract code_verifier from signed token
            extracted_code_verifier = payload.get("code_verifier")
            
            # If code_verifier was provided for verification, check it matches
            if code_verifier and extracted_code_verifier:
                if code_verifier != extracted_code_verifier:
                    logger.warning("PKCE code_verifier mismatch")
                    raise InvalidStateError("PKCE code_verifier mismatch")
            
            # Return success with extracted code_verifier
            return True, extracted_code_verifier
            
        except jwt.ExpiredSignatureError:
            logger.warning("State token has expired")
            raise InvalidStateError("State parameter has expired")
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid state token: {e}")
            raise InvalidStateError("Invalid state parameter") from e
        except Exception as e:
            logger.error(f"Error validating state token: {e}", exc_info=True)
            raise InvalidStateError("State validation failed") from e

    # ============================================================================
    # PKCE (Proof Key for Code Exchange) Support
    # ============================================================================

    @staticmethod
    def generate_pkce_pair() -> Tuple[str, str]:
        """
        Generate PKCE code_verifier and code_challenge pair.
        
        Returns:
            Tuple of (code_verifier, code_challenge)
        """
        # Generate code_verifier: random URL-safe string, 43-128 characters
        code_verifier = secrets.token_urlsafe(32)  # 32 bytes = 43 chars base64url
        
        # Generate code_challenge: SHA256 hash of code_verifier, base64url encoded
        code_challenge_bytes = hashlib.sha256(code_verifier.encode('utf-8')).digest()
        code_challenge = base64.urlsafe_b64encode(code_challenge_bytes).decode('utf-8').rstrip('=')
        
        return code_verifier, code_challenge
