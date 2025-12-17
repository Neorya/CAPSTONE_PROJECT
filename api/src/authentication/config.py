"""
Configuration settings for the authentication module.

This module contains all configurable values for authentication behavior,
making it easy to adjust settings without modifying business logic.
"""

from datetime import timedelta

# ============================================================================
# TOKEN CONFIGURATION
# ============================================================================

# Access Token Configuration
# Short-lived JWT tokens used for API requests
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # 15 minutes

# Refresh Token Configuration
# Long-lived tokens used to obtain new access tokens without re-authentication
# Can be easily changed here without modifying service logic
REFRESH_TOKEN_EXPIRE_DAYS = 7  # 7 days
REFRESH_TOKEN_EXPIRE_TIMEDELTA = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

# ============================================================================
# OAUTH CONFIGURATION
# ============================================================================

# Google OAuth Settings (to be filled in from environment variables)
GOOGLE_OAUTH_CLIENT_ID = None  # TODO: Load from environment variable
GOOGLE_OAUTH_CLIENT_SECRET = None  # TODO: Load from environment variable
GOOGLE_OAUTH_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

# ============================================================================
# SECURITY CONFIGURATION
# ============================================================================

# JWT Secret Key (should be loaded from environment in production)
JWT_SECRET_KEY = None  # TODO: Load from environment variable
JWT_ALGORITHM = "HS256"

# Password/Token Hashing
TOKEN_HASH_ALGORITHM = "sha256"  # Algorithm for hashing refresh tokens before storage

# ============================================================================
# ROLE CONFIGURATION
# ============================================================================

# Default role for new users
DEFAULT_USER_ROLE = "student"

# Available roles in the system
AVAILABLE_ROLES = ["student", "teacher", "admin"]

# ============================================================================
# NOTES
# ============================================================================
"""
To change refresh token duration:
1. Update REFRESH_TOKEN_EXPIRE_DAYS to desired number of days
2. REFRESH_TOKEN_EXPIRE_TIMEDELTA will be automatically calculated
3. No other code changes needed

Example:
- REFRESH_TOKEN_EXPIRE_DAYS = 14  # for 14 days
- REFRESH_TOKEN_EXPIRE_DAYS = 30  # for 30 days
- REFRESH_TOKEN_EXPIRE_DAYS = 7   # for 7 days (current)
"""
