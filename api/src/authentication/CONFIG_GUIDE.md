# Authentication Configuration Guide

## Overview

All authentication settings are centralized in `api/src/authentication/config.py` for easy management and adjustment without modifying business logic.

This guide explains the configuration, token workflow, and how to customize authentication behavior.

## Token Workflow

### Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ TOKEN LIFECYCLE AND MANAGEMENT                                   │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: INITIAL AUTHENTICATION (User Login)
─────────────────────────────────────────────
1. User clicks "Sign in with Google"
   ↓
2. Google OAuth verifies identity, returns ID token
   ↓
3. Backend verifies Google token
   ↓
4. Backend finds or creates user in capstone_app.users
   ↓
5. Backend generates two tokens:
   │
   ├─ Access Token (Short-lived JWT)
   │  ├─ Duration: 15 minutes
   │  ├─ Contains: user_id, email, role
   │  ├─ Signed with JWT_SECRET_KEY
   │  └─ Sent to client (memory/sessionStorage)
   │
   └─ Refresh Token (Long-lived)
      ├─ Duration: 7 days (configurable)
      ├─ Hashed using SHA-256
      ├─ Stored in capstone_app.refresh_tokens table
      └─ Sent to client (httpOnly cookie)
   ↓
6. Client stores both tokens
   ↓
7. User is now authenticated ✓


PHASE 2: NORMAL API REQUESTS (Token is Valid)
──────────────────────────────────────────────
1. Client makes request: GET /api/matches
   + Header: Authorization: Bearer [access_token]
   ↓
2. Server validates access token:
   ├─ Verify JWT signature (using JWT_SECRET_KEY)
   ├─ Check expiration time (exp claim)
   ├─ Extract user_id and role from claims
   └─ If all valid → Continue
   ↓
3. Server processes request with user context
   ↓
4. Server returns 200 OK with data ✓


PHASE 3: TOKEN REFRESH (Access Token Expired)
─────────────────────────────────────────────
Time: 15 minutes after access token issued

1. Client makes request: GET /api/matches
   + Header: Authorization: Bearer [expired_token]
   ↓
2. Server validates access token:
   ├─ Verify JWT signature ✓
   └─ Check expiration time ✗ EXPIRED!
   ↓
3. Server returns 401 Unauthorized
   ↓
4. Client detects 401 error
   ↓
5. Client initiates refresh: POST /auth/refresh
   + Body: { refresh_token: "[refresh_token]" }
   ↓
6. Server validates refresh token in database:
   ├─ Hash the refresh token
   ├─ Query capstone_app.refresh_tokens by token_hash
   ├─ Check: revoked_at is NULL? (not revoked)
   ├─ Check: expires_at > NOW? (not expired)
   ├─ Check: associated user still exists?
   └─ If all valid → Issue new access token
   ↓
7. Server issues NEW access token:
   ├─ Duration: 15 minutes
   ├─ Contains: current user_id, email, CURRENT role
   ├─ Signed with JWT_SECRET_KEY
   └─ Sent to client
   ↓
8. Client stores new access token
   ↓
9. Client retries original request with new token
   ↓
10. Request succeeds ✓


PHASE 4: LOGOUT (Token Revocation)
──────────────────────────────────
1. User clicks "Logout"
   ↓
2. Client sends: POST /auth/logout
   + Body: { refresh_token: "[refresh_token]" }
   ↓
3. Server revokes the refresh token:
   ├─ Hash the refresh token
   ├─ Find token in capstone_app.refresh_tokens
   ├─ Set revoked_at = NOW()
   ├─ Commit to database
   └─ Token is now invalid forever
   ↓
4. Client clears stored tokens from memory
   ↓
5. User is logged out ✓
   (If token not revoked, it would still work until expires_at)


PHASE 5: ADMIN ROLE CHANGE (Within 15 Minutes)
───────────────────────────────────────────────
1. Admin changes user's role: student → teacher
   ├─ Update capstone_app.users.role = 'teacher'
   └─ Database committed
   ↓
2. User's current access token still has old role claim
   (Token is valid until expiry)
   ↓
3. User makes request within 15 minutes
   + Header: Authorization: Bearer [old_token_with_student_role]
   ↓
4. Server validates token (still valid)
   └─ User can still access as "student"
   ↓
5. User makes request after 15 minutes
   └─ Access token expires
   ↓
6. Client refreshes token: POST /auth/refresh
   ↓
7. Server issues NEW access token:
   ├─ Fetches current user from database
   ├─ New token contains: role = 'teacher' (current role)
   └─ Sent to client
   ↓
8. User now has "teacher" role ✓
   (Role change effective within 15 minutes)
```

---

## Current Configuration

### Token Durations

- **Access Token**: 15 minutes (900 seconds)
  - Short-lived JWT tokens used for API requests
  - Setting: `ACCESS_TOKEN_EXPIRE_MINUTES = 15`

- **Refresh Token**: 7 days
  - Long-lived tokens for obtaining new access tokens
  - Setting: `REFRESH_TOKEN_EXPIRE_DAYS = 7`
  - Calculated: `REFRESH_TOKEN_EXPIRE_TIMEDELTA = timedelta(days=7)`

## How to Change Token Duration

### To change the refresh token duration:

1. Open `api/src/authentication/config.py`
2. Find the line: `REFRESH_TOKEN_EXPIRE_DAYS = 7`
3. Change the number to your desired duration:

**Examples:**
```python
# 1 week (current)
REFRESH_TOKEN_EXPIRE_DAYS = 7

# 2 weeks
REFRESH_TOKEN_EXPIRE_DAYS = 14

# 1 month
REFRESH_TOKEN_EXPIRE_DAYS = 30

# 3 days (shorter, more secure)
REFRESH_TOKEN_EXPIRE_DAYS = 3
```

4. The `REFRESH_TOKEN_EXPIRE_TIMEDELTA` is automatically calculated from this value
5. No other code changes needed - the services will use the updated duration

## Configuration Structure

### Token Configuration Section
```python
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
REFRESH_TOKEN_EXPIRE_TIMEDELTA = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
```

### OAuth Configuration Section
- Google OAuth client ID and secret (load from environment variables)
- Google OAuth discovery URL

### Security Configuration Section
- JWT secret key (load from environment variables)
- JWT algorithm (HS256)
- Token hashing algorithm (SHA-256)

### Role Configuration Section
- Default role for new users: `student`
- Available roles: `student`, `teacher`, `admin`

## Environment Variables (To be implemented)

These settings should be loaded from environment variables in production:

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `JWT_SECRET_KEY`

## Best Practices

1. **Security vs UX Trade-off**:
   - Shorter duration (3-7 days): More secure, users need to re-authenticate more frequently
   - Longer duration (14-30 days): Better UX, users stay logged in longer

2. **Recommendation for different scenarios**:
   - **High-security applications**: 3-5 days
   - **Standard applications**: 7 days (current)
   - **User-friendly applications**: 14+ days

3. **Role change propagation**:
   - Role changes take effect within the access token lifetime (15 minutes)
   - If you want faster role propagation, reduce `ACCESS_TOKEN_EXPIRE_MINUTES`

## Token Management Details

### Short-Lived Access Tokens (JWT)

**What it is:**
- Stateless JSON Web Token (JWT)
- Contains user claims: user_id, email, role, exp, iat
- Signed with `JWT_SECRET_KEY`
- Never stored in database

**How it's validated:**
1. Client sends token in Authorization header: `Bearer [token]`
2. Server verifies JWT signature using `JWT_SECRET_KEY`
3. Server checks `exp` claim (expiration time)
4. If valid and not expired → Process request
5. If expired or invalid → Return 401 Unauthorized

**Why short-lived (15 minutes)?**
- If token stolen, attacker has limited window (15 min)
- After 15 min, token becomes useless automatically
- Forces regular token refresh, allowing role updates
- No database lookup needed for validation (fast)

### Long-Lived Refresh Tokens

**What it is:**
- Random token generated server-side
- Token is hashed (SHA-256) before storing
- Only the hash is stored in `capstone_app.refresh_tokens` table
- Raw token never persisted

**Database Storage:**
```sql
-- Stored in capstone_app.refresh_tokens
id              SERIAL PRIMARY KEY
user_id         INTEGER (FK → users.id)
token_hash      TEXT (unique, hashed refresh token)
expires_at      TIMESTAMP (when token expires)
revoked_at      TIMESTAMP (when revoked, NULL if active)
created_at      TIMESTAMP (when created)
```

**How it's validated:**
1. Client sends refresh token to `/auth/refresh` endpoint
2. Server hashes the refresh token
3. Server queries database: `SELECT * FROM refresh_tokens WHERE token_hash = ?`
4. Server checks:
   - `revoked_at IS NULL` (not revoked)
   - `expires_at > NOW()` (not expired)
   - Associated user still exists
5. If valid → Issue new access token
6. If invalid → Return 401 Unauthorized

**Why long-lived (7 days)?**
- Users stay logged in without re-authenticating
- Better user experience (7 days is standard)
- Still revocable for security (logout, security events)
- Database-backed allows revocation, unlike stateless tokens

---

## Table: Access Token vs Refresh Token Comparison

| Aspect | Access Token (Short-lived) | Refresh Token (Long-lived) |
|--------|---------------------------|---------------------------|
| **Type** | JWT (Stateless) | Random (Stateful) |
| **Duration** | 15 minutes | 7 days (configurable) |
| **Storage Location** | Client-side (memory/sessionStorage) | Client-side (httpOnly cookie) + Database |
| **Database Stored?** | NO | YES (hashed) |
| **Validation Method** | JWT signature + expiration check | Database lookup + validation |
| **If Stolen** | Valid for 15 min | Can be revoked immediately OR use until expires_at |
| **Use Case** | Authenticate API requests | Get new access token |
| **Revocation** | Expires naturally | Can revoke by setting revoked_at |
| **Contains** | user_id, email, role, exp, iat | None (just random string) |
| **Signature** | Signed with JWT_SECRET_KEY | Hashed with SHA-256 |

---

## Implementation Notes

- All token creation logic in `auth_service.py` will reference `config.py` settings
- No hardcoded durations in business logic
- Configuration is centralized for easy maintenance
- Access token validation is fast (no DB lookup, just JWT verification)
- Refresh token validation requires database query (for revocation check)
- Both tokens work together for optimal security + UX
