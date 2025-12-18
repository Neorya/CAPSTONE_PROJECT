import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import jwt
import httpx
from sqlalchemy.orm import Session
from authentication.models.user import User, UserRoleEnum
from authentication.models.refresh_token import RefreshToken
from authentication.repositories.user_repository import UserRepository
from authentication.repositories.refresh_token_repository import RefreshTokenRepository
from authentication.schema.user_schema import UserCreateFromGoogle
from authentication.schema.token_schema import TokenResponse, AccessTokenPayload

"""
Business logic layer for authentication domain.

Handles:
- Token generation (access and refresh tokens)
- Token validation and verification
- Google OAuth token verification
- User authentication workflow
"""

# TODO: Import required libraries
from authentication.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_TIMEDELTA,
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
    TOKEN_HASH_ALGORITHM,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_DISCOVERY_URL,
)


# TODO: Create AuthService class with the following methods:
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


# TODO: Implement verify_google_token(token: str) -> dict
# - Verify Google ID token using Google's public keys
# - Validate token signature and claims
# - Extract user information (google_sub, email, name, picture)
# - Return decoded token payload or raise exception if invalid

#TODO check if this is correct because i'm not sure at all

    @staticmethod
    async def verify_google_token(token: str) -> dict:
        # Fetch Google's public keys
        async with httpx.AsyncClient() as client:
            discovery_resp = await client.get(GOOGLE_OAUTH_DISCOVERY_URL)
            discovery_data = discovery_resp.json()
            jwks_uri = discovery_data["jwks_uri"]
            jwks_resp = await client.get(jwks_uri)
            jwks = jwks_resp.json()

        # Decode and verify token
        try:
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header["kid"]
            key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
            if key is None:
                raise Exception("Public key not found")

            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=GOOGLE_OAUTH_CLIENT_ID,
                issuer="https://accounts.google.com",
            )
            return payload
        except Exception as e:
            raise Exception(f"Invalid Google token: {str(e)}")

    #TODO: KEEPING AS COMMENTED FOR NOW, NOT SURE IF NEEDED
    
    @staticmethod
    async def exchange_code_for_id_token(code: str) -> str:
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            resp.raise_for_status()
            token_data = resp.json()
        id_token = token_data.get("id_token")
        if not id_token:
            raise Exception("No id_token in response from Google")
        return id_token
    

# TODO: Implement issue_access_token(user: User, expires_in: int = 900) -> str
# - Generate JWT access token with 15-minute (900s) expiration
# - Include claims: user_id, email, role
# - Sign token with secret key
# - Return encoded JWT token
    @staticmethod
    def issue_access_token(user: User, expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES * 60) -> str:
        expire = datetime.utcnow() + timedelta(seconds=expires_in)
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "exp": expire,
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return token


# TODO: Implement issue_refresh_token(user_id: int, db: Session, expires_in_days: int = 7) -> Tuple[str, str]
# - Generate random refresh token
# - Hash the token for storage
# - Store hashed token in database with expiration time
# - Return (raw_token, hashed_token) tuple
# - Raw token sent to client, hashed stored in DB
    @staticmethod
    def issue_refresh_token(user_id: int, db: Session, expires_in_days: int = 7) -> Tuple[str, str]:
        raw_token = AuthService.generate_random_token()
        hashed_token = AuthService.hash_token(raw_token)
        expires_at = datetime.utcnow() + timedelta(days=expires_in_days)

        # Store hashed token in database
        RefreshTokenRepository.create(
            db=db,
            user_id=user_id,
            token_hash=hashed_token,
            expires_at=expires_at
        )

        return raw_token, hashed_token


# TODO: Implement authenticate_with_google(google_token: str, db: Session) -> Tuple[User, str, str]
# - Verify Google ID token
# - Extract user information
# - Find or create user in database
# - Issue access token and refresh token
# - Return (user, access_token, refresh_token)
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


# TODO: Implement refresh_access_token(refresh_token: str, db: Session) -> str
# - Validate refresh token (check if valid, not revoked, not expired)
# - Look up user from refresh token
# - Get user's current role from database
# - Issue new access token with current role
# - Return new access token
    @staticmethod
    def refresh_access_token(refresh_token: str, db: Session) -> str:
        # Hash the provided refresh token
        hashed_token = AuthService.hash_token(refresh_token)

        # Validate the refresh token
        token_record = RefreshTokenRepository.get_by_token_hash(db, hashed_token)
        if not token_record or not token_record.is_valid():
            raise Exception("Invalid or expired refresh token")

        # Look up user from refresh token
        user = UserRepository.get_by_id(db, token_record.user_id)
        if not user:
            raise Exception("User not found")
        # Get user's current role from database
        # role = user.role 
        # if role != token_record.role:
        #     raise Exception("User role has changed, please re-authenticate")
        # Issue new access token with current role
        new_access_token = AuthService.issue_access_token(user)

        return new_access_token


# TODO: Implement validate_access_token(access_token: str) -> dict
# - Decode JWT token
# - Verify signature
# - Check expiration
# - Return decoded payload with user_id and role
# - Raise exception if token is invalid or expired
    @staticmethod
    def validate_access_token(access_token: str) -> dict:
        try:
            payload = jwt.decode(access_token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            expiration = payload.get("exp")
            if expiration and datetime.fromtimestamp(expiration) < datetime.utcnow():
                raise Exception("Access token has expired")
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Access token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid access token")


# TODO: Implement revoke_refresh_token(refresh_token_raw: str, db: Session) -> bool
# - Hash the raw refresh token
# - Find token by hash in database
# - Set revoked_at timestamp
# - Commit changes
# - Return True if successful
    @staticmethod
    def revoke_refresh_token(refresh_token_raw: str, db: Session) -> bool:
        hashed_token = AuthService.hash_token(refresh_token_raw)
        token_record = RefreshTokenRepository.get_by_token_hash(db, hashed_token)
        if not token_record:
            return False
        token_record.revoked_at = datetime.utcnow()
        #maybe we can just delete it?
        #db.delete(token_record)
        db.commit()
        return True


# TODO: Implement revoke_all_user_tokens(user_id: int, db: Session) -> int
# - Revoke all refresh tokens for a specific user
# - Used for logout all sessions
# - Return count of revoked tokens
    @staticmethod
    def revoke_all_user_tokens(user_id: int, db: Session) -> int:
        revoked_count = RefreshTokenRepository.revoke_all_for_user(db, user_id)
        return revoked_count


# TODO: Implement hash_token(token: str) -> str
# - Hash refresh token using SHA-256
# - Used for secure storage in database
# - Raw tokens never stored
    @staticmethod
    def hash_token(token: str) -> str:
        hasher = hashlib.new(TOKEN_HASH_ALGORITHM)
        hasher.update(token.encode('utf-8'))
        return hasher.hexdigest()
    


# TODO: Implement generate_random_token(length: int = 64) -> str
# - Generate random token string for refresh token
# - Use secrets module for cryptographically secure randomness
    @staticmethod
    def generate_random_token(length: int = 64) -> str:
        return secrets.token_urlsafe(length)


# TODO: (Optional) Implement check_role_change(user_id: int, old_role: str, db: Session) -> bool
# - Check if user's role has changed in database
# - Used to verify role changes after token refresh
    @staticmethod
    def check_role_change(user_id: int, old_role: str, db: Session) -> bool:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            raise Exception("User not found")
        return user.role != old_role
