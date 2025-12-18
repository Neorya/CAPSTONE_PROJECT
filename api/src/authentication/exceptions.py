"""
Custom exception classes for authentication domain.

These exceptions allow for proper error categorization and HTTP status code mapping.
"""


class AuthenticationError(Exception):
    """Base exception for authentication errors."""
    pass


class InvalidTokenError(AuthenticationError):
    """Raised when a token is invalid, expired, or malformed."""
    pass


class InvalidStateError(AuthenticationError):
    """Raised when OAuth state parameter is invalid or expired."""
    pass


class TokenExpiredError(AuthenticationError):
    """Raised when a token has expired."""
    pass


class TokenRevokedError(AuthenticationError):
    """Raised when a token has been revoked."""
    pass


class UserNotFoundError(AuthenticationError):
    """Raised when a user cannot be found."""
    pass


class OAuthProviderError(AuthenticationError):
    """Raised when OAuth provider (Google) returns an error or times out."""
    pass


class DatabaseError(AuthenticationError):
    """Raised when a database operation fails."""
    pass


class ConfigurationError(AuthenticationError):
    """Raised when configuration is missing or invalid."""
    pass
