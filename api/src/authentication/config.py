"""
Configuration settings for the authentication module.

This module contains all configurable values for authentication behavior,
making it easy to adjust settings without modifying business logic.
"""

import os
from datetime import timedelta

# ============================================================================
# TOKEN CONFIGURATION
# ============================================================================

# Access Token Configuration
# JWT tokens used for API requests
ACCESS_TOKEN_EXPIRE_MINUTES = 120  # 2 hours (120 minutes)

# Refresh Token Configuration
# Long-lived tokens used to obtain new access tokens without re-authentication
# Can be easily changed here without modifying service logic
REFRESH_TOKEN_EXPIRE_DAYS = 7  # 7 days
REFRESH_TOKEN_EXPIRE_TIMEDELTA = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

# ============================================================================
# OAUTH CONFIGURATION
# ============================================================================

# Google OAuth Settings (to be filled in from environment variables)
GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
GOOGLE_OAUTH_REDIRECT_URI = os.getenv("GOOGLE_OAUTH_REDIRECT_URI")
GOOGLE_OAUTH_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

# ============================================================================
# SECURITY CONFIGURATION
# ============================================================================

# JWT Secret Key (should be loaded from environment in production)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
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
# VALIDATION
# ============================================================================

def validate_required_env_vars():
    """
    Validate that all required environment variables are set.
    Raises ValueError with clear message if any are missing.
    Should be called at application startup.
    """
    required_vars = {
        "JWT_SECRET_KEY": JWT_SECRET_KEY,
        "GOOGLE_OAUTH_CLIENT_ID": GOOGLE_OAUTH_CLIENT_ID,
        "GOOGLE_OAUTH_CLIENT_SECRET": GOOGLE_OAUTH_CLIENT_SECRET,
        "GOOGLE_OAUTH_REDIRECT_URI": GOOGLE_OAUTH_REDIRECT_URI,
    }
    
    missing_vars = [var_name for var_name, var_value in required_vars.items() if not var_value]
    
    if missing_vars:
        missing_list = ", ".join(missing_vars)
        raise ValueError(
            f"Missing required environment variables: {missing_list}. "
            f"Please set these variables before starting the application."
        )

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
