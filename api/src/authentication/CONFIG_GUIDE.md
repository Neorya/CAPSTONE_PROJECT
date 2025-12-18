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
1. Frontend calls GET /auth/initiate
   ↓
2. Frontend generates (PKCE, Option A - recommended):
   ├─ PKCE code_verifier (kept client-side)
   └─ PKCE code_challenge (sent to Google via authorization URL)
   ↓
3. Backend generates:
   └─ OAuth state token (CSRF protection; signed + short-lived)
   ↓
4. Backend returns Google authorization URL with state + code_challenge
   ↓
5. Frontend redirects user to Google authorization URL
   ↓
6. User authenticates with Google
   ↓
7. Google redirects to: GET /auth/callback?code=...&state=...
   ↓
8. Backend validates state parameter (CSRF protection)
   ↓
9. Backend exchanges authorization code for ID token (requires PKCE code_verifier from frontend)
   ↓
10. Backend verifies Google ID token:
   ├─ Validates signature using Google's JWKS (cached)
   ├─ Checks expiration, audience, issuer
   ├─ Validates email_verified claim
   └─ Supports multiple issuer variants
   ↓
11. Backend finds or creates user in capstone_app.users
   ↓
12. Backend generates two tokens:
   │
   ├─ Access Token (Short-lived JWT)
   │  ├─ Duration: 15 minutes
   │  ├─ Contains: sub (user_id), email, role
   │  ├─ Signed with JWT_SECRET_KEY
   │  └─ Sent to client in response body (store in memory/sessionStorage)
   │
   └─ Refresh Token (Long-lived)
      ├─ Duration: 7 days (configurable)
      ├─ Hashed using SHA-256 before storage
      ├─ Stored in capstone_app.refresh_tokens table
      └─ Sent to client via httpOnly cookie (secure, SameSite=lax)
   ↓
13. Client stores access token (refresh token automatically handled by browser)
   ↓
14. User is now authenticated ✓


PHASE 2: NORMAL API REQUESTS (Token is Valid)
──────────────────────────────────────────────
1. Client makes request: GET /api/matches
   + Header: Authorization: Bearer [access_token]
   ↓
2. Server validates access token:
   ├─ Verify JWT signature (using JWT_SECRET_KEY)
   ├─ Check expiration time (exp claim)
   ├─ Extract sub (user_id) and role from claims
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
   + Cookie: refresh_token=[refresh_token] (automatically sent by browser)
   ↓
6. Server reads refresh token from httpOnly cookie
   ↓
7. Server validates refresh token in database:
   ├─ Hash the refresh token
   ├─ Query capstone_app.refresh_tokens by token_hash
   ├─ Check: revoked_at is NULL? (not revoked)
   ├─ Check: expires_at > NOW? (not expired)
   ├─ Check: associated user still exists?
   └─ If all valid → Revoke old token and issue new tokens
   ↓
8. Server implements refresh token rotation:
   ├─ Sets revoked_at = NOW() for old refresh token
   ├─ Issues NEW access token (15 minutes, current role)
   ├─ Issues NEW refresh token (7 days)
   └─ Sets new refresh token in httpOnly cookie
   ↓
9. Server returns new access token in response body
   ↓
10. Client stores new access token
   ↓
11. Client retries original request with new token
   ↓
12. Request succeeds ✓


PHASE 4: LOGOUT (Token Revocation)
──────────────────────────────────
1. User clicks "Logout"
   ↓
2. Client sends: POST /auth/logout
   + Cookie: refresh_token=[refresh_token] (automatically sent by browser)
   ↓
3. Server reads refresh token from httpOnly cookie
   ↓
4. Server revokes the refresh token:
   ├─ Hash the refresh token
   ├─ Find token in capstone_app.refresh_tokens
   ├─ Set revoked_at = NOW()
   ├─ Commit to database
   └─ Token is now invalid forever
   ↓
5. Server clears refresh_token cookie (delete_cookie)
   ↓
6. Client clears access token from memory
   ↓
7. User is logged out ✓
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
   + Cookie: refresh_token=[refresh_token]
   ↓
7. Server implements refresh token rotation:
   ├─ Revokes old refresh token
   ├─ Issues NEW access token with current role from database
   ├─ Issues NEW refresh token
   └─ Sets new refresh token in cookie
   ↓
8. Server returns new access token (role = 'teacher')
   ↓
9. User now has "teacher" role ✓
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

## Environment Variables

These settings should be loaded from environment variables in production:

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`
- `JWT_SECRET_KEY`
- `ENVIRONMENT` (set to `production` to enable secure cookies)

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
| **Storage Location** | Client-side (memory/sessionStorage) | httpOnly cookie (browser-managed) + Database |
| **Database Stored?** | NO | YES (hashed) |
| **Validation Method** | JWT signature + expiration check | Database lookup + validation |
| **If Stolen** | Valid for 15 min | Can be revoked immediately OR use until expires_at |
| **Use Case** | Authenticate API requests | Get new access token |
| **Revocation** | Expires naturally | Can revoke by setting revoked_at |
| **Rotation** | No | Yes - new token issued on each refresh |
| **Contains** | sub (user_id), email, role, exp | None (just random string) |
| **Signature** | Signed with JWT_SECRET_KEY | Hashed with SHA-256 |
| **Transport** | Authorization header (Bearer) | httpOnly cookie (secure, SameSite=lax) |

---

## Implementation Notes

- All token creation logic in `auth_service.py` references `config.py` settings
- No hardcoded durations in business logic
- Configuration is centralized for easy maintenance
- Access token validation is fast (no DB lookup, just JWT verification)
- Refresh token validation requires database query (for revocation check)
- Refresh tokens use **rotation** - new token issued on each refresh, old token revoked
- Refresh tokens sent via **httpOnly cookies** for enhanced security (XSS protection)
- OAuth flow uses **PKCE** (Proof Key for Code Exchange) for enhanced security
- OAuth state parameter validated to prevent CSRF attacks
- Google token verification includes email_verified check and JWKS caching
- Both tokens work together for optimal security + UX

## Security Features

### OAuth Flow Security
- **State Parameter**: CSRF protection - state token generated server-side, validated on callback
- **PKCE**: Code verifier/challenge prevents authorization code interception attacks
- **Email Verification**: Google tokens validated for email_verified claim

### Token Security
- **Refresh Token Rotation**: Old token revoked when new one issued (prevents token reuse)
- **httpOnly Cookies**: Refresh tokens not accessible to JavaScript (XSS protection)
- **Secure Cookies**: HTTPS-only in production (secure=True)
- **SameSite Protection**: CSRF protection via SameSite=lax cookie attribute
- **Token Hashing**: Refresh tokens hashed before database storage (SHA-256)

### Error Handling
- **Specific Exceptions**: Custom exception types for different error scenarios
- **Client-Safe Messages**: Generic error messages to clients, detailed logging server-side
- **Proper HTTP Status Codes**: 400 (bad request), 401 (unauthorized), 500 (server error), 502 (upstream error)

---

## Frontend Integration Guide

This section provides guidance for integrating the authentication system with your frontend application. The recommended approach uses **client-side storage for PKCE code_verifier** (Option A) for optimal security.

### Overview

The authentication flow requires coordination between frontend and backend:
- Frontend initiates OAuth flow and stores PKCE code_verifier securely
- Frontend handles OAuth callback and sends code_verifier back to backend
- Frontend stores access token and manages token refresh
- Frontend handles logout and token cleanup

### Integration Steps

#### Step 1: Initiate OAuth Flow

**When**: User clicks "Sign in with Google" button

**Action**:
1. Call `GET /auth/initiate` endpoint
2. Backend returns:
   - `authorization_url`: Google OAuth URL containing `state` and PKCE `code_challenge`
   - `state`: Signed state token (for CSRF protection)
3. **Generate `code_verifier` client-side** (cryptographically secure random string, 43–128 characters)
4. **Derive `code_challenge` from `code_verifier`** and ensure the authorization URL uses that challenge
   - If your backend builds the authorization URL, it must do so using the **frontend-provided** `code_challenge` (Option A)
5. **Store `state` and `code_verifier`** temporarily (sessionStorage recommended)
6. Redirect user to `authorization_url`

**Security Notes**:
- `code_verifier` must be stored client-side (sessionStorage) - never send it to backend until callback
- `code_verifier` should be cleared after successful authentication or on error
- Use sessionStorage (not localStorage) so it's cleared when tab closes

#### Step 2: Handle OAuth Callback

**When**: Google redirects back to your frontend callback URL

**Understanding the Parameters**:
- **`code`**: Authorization code from Google (short-lived, single-use). This is what Google returns after user authenticates. Your backend exchanges this code for an ID token.
- **`state`**: CSRF protection token. This is the signed state token your backend generated in Step 1. You must verify it matches what you stored to prevent CSRF attacks.

**Action**:
1. Extract `code` and `state` from URL query parameters
2. Retrieve stored `state` from sessionStorage and verify it matches (CSRF protection)
3. Retrieve stored `code_verifier` from sessionStorage
4. Call `GET /auth/callback?code={code}&state={state}` and provide `code_verifier` to the backend
   - **Note**: The backend must accept `code_verifier` (e.g., query parameter or header) to complete the PKCE code exchange.
5. Backend validates state, exchanges code for tokens using `code_verifier`
6. Backend returns:
   - `access_token`: JWT access token (store in memory or sessionStorage)
   - `refresh_token`: Set in httpOnly cookie automatically (browser manages)
   - `token_type`: "Bearer"
   - `expires_in`: Seconds until access token expires
7. **Store `access_token`** in memory or sessionStorage
8. **Clear `code_verifier` and `state`** from sessionStorage (no longer needed)
9. Redirect user to your application's main page

**Error Handling**:
- If state mismatch: Show error, clear stored values, restart flow
- If callback fails: Show error message, allow user to retry
- If 401/400: Invalid state or code - restart authentication flow

#### Step 3: Make Authenticated API Requests

**When**: Frontend makes API calls to protected endpoints

**Action**:
1. Retrieve `access_token` from storage
2. Include in request header: `Authorization: Bearer {access_token}`
3. If request returns 401 Unauthorized:
   - Token expired - proceed to Step 4 (Token Refresh)

**Best Practices**:
- Store access token in memory (React state, Vue data) or sessionStorage
- Never store access token in localStorage (XSS risk)
- Include token in all API requests to protected endpoints

#### Step 4: Refresh Access Token

**When**: Access token expires (401 response) or before expiration (proactive refresh)

**Action**:
1. Call `POST /auth/refresh` endpoint
   - No body required - refresh token sent automatically via httpOnly cookie
2. Backend validates refresh token, revokes old one, issues new tokens
3. Backend returns:
   - `access_token`: New JWT access token
   - `refresh_token`: Set in httpOnly cookie automatically (rotation)
   - `token_type`: "Bearer"
   - `expires_in`: Seconds until new access token expires
4. **Update stored `access_token`** with new value
5. Retry original API request with new access token

**Error Handling**:
- If 401: Refresh token invalid/expired - redirect to login (Step 1)
- If 500: Server error - show error message, allow retry
- Implement exponential backoff for retries

**Proactive Refresh**:
- Refresh access token 1-2 minutes before expiration
- Use `expires_in` value to calculate refresh time
- Prevents user-facing 401 errors

#### Step 5: Handle Logout

**When**: User clicks "Logout" button

**Action**:
1. Call `POST /auth/logout` endpoint
   - No body required - refresh token sent automatically via httpOnly cookie
2. Backend revokes refresh token and clears cookie
3. Backend returns success message
4. **Clear `access_token`** from frontend storage
5. **Clear any stored `code_verifier` or `state`** (if still present)
6. Redirect user to login page

**Error Handling**:
- If logout fails: Still clear frontend tokens and redirect (idempotent)
- Logout should always succeed from user perspective

### Security Considerations

#### PKCE Code Verifier Storage (Option A - Recommended)

**Why Client-Side Storage**:
- Code verifier must remain secret until callback
- Embedding in signed state token exposes it (JWT payloads are readable)
- Client-side storage keeps verifier secret until needed

**Backend Compatibility Note**:
- To fully implement Option A, the backend must **not** embed the raw `code_verifier` into `state`.
- The backend should only validate `state` (CSRF protection) and use the **frontend-supplied** `code_verifier` when exchanging the authorization `code` with Google.

**Storage Method**:
- Use `sessionStorage` (not `localStorage`)
- SessionStorage cleared when tab closes (better security)
- Clear immediately after successful authentication
- Clear on any error or logout

**Security Benefits**:
- Code verifier never exposed in URLs or server logs
- Only accessible to JavaScript in same origin
- Automatically cleared on tab close
- Prevents authorization code interception attacks

#### Access Token Storage

**Recommended**: Store in memory (React state, Vue data) or sessionStorage

**Why Not localStorage**:
- localStorage persists across tabs (XSS risk)
- Accessible to any script on same origin
- Harder to clear on logout

**Why sessionStorage is Acceptable**:
- Cleared when tab closes
- Better than localStorage for security
- Still accessible to XSS, but limited scope

**Best Practice**:
- Use **in-memory** storage for `access_token` during a tab session (React Context, Redux, etc.).
- Use the **refresh-token cookie** to restore the session after a reload or browser restart (see next section).

#### Staying Logged In After Closing the Browser (Recommended)

If you want users to remain authenticated after closing the browser, do **not** rely on sessionStorage for persistence.

**Recommended pattern** (secure + common):
- **Access token**: short-lived, stored **in memory only** (lost on refresh/restart — that’s OK).
- **Refresh token**: stored in a **persistent httpOnly cookie** (survives browser restart).
- **App startup behavior**: perform a **silent refresh** on page load.

**How it works**:
1. User reopens the app (no access token available in memory).
2. Frontend calls `POST /auth/refresh` immediately (or whenever it detects no valid access token).
3. Browser automatically sends the refresh-token cookie.
4. Backend validates the refresh token, rotates it, and returns a fresh access token.
5. Frontend stores the new access token in memory and continues normally.

**Requirements**:
- Refresh cookie must be **persistent** (must have `Max-Age`/`Expires`).
- Refresh cookie must be **usable** in the user’s browser context (HTTPS in production, correct domain/path, cookies not blocked).
- Frontend requests must include credentials so cookies are sent.

#### Refresh Token Handling

**Automatic**: Refresh tokens sent via httpOnly cookies (browser-managed)

**Frontend Responsibilities**:
- No need to manually handle refresh token storage
- Ensure cookies are sent with requests (credentials: 'include' in fetch)
- Handle cookie clearing on logout (backend handles this)

### Error Handling Strategy

#### Network Errors
- Show user-friendly error messages
- Allow retry for transient errors
- Log errors for debugging

#### Authentication Errors (401)
- Access token expired: Automatically refresh (Step 4)
- Refresh token invalid: Redirect to login (Step 1)
- State invalid: Restart OAuth flow (Step 1)

#### Server Errors (500/502)
- Show generic error message to user
- Log detailed error for debugging
- Allow retry with exponential backoff

### CORS Configuration

**Required Settings**:
- `allow_origins`: Your frontend URL
- `allow_credentials`: `true` (required for httpOnly cookies)
- `allow_methods`: Include GET, POST
- `allow_headers`: Include "Authorization", "Content-Type"

**Frontend Request Configuration**:
- Include `credentials: 'include'` in fetch requests
- Ensures cookies are sent with requests
- Required for refresh token cookie to work

### Testing Checklist

Before deploying, verify:
- [ ] OAuth initiation works and stores code_verifier
- [ ] Callback handles success and error cases
- [ ] Access token stored and included in API requests
- [ ] Token refresh works automatically on 401
- [ ] Token refresh works proactively before expiration
- [ ] Logout clears all tokens and redirects
- [ ] Code verifier cleared after authentication
- [ ] State validation prevents CSRF attacks
- [ ] Cookies sent with requests (credentials: include)
- [ ] Error handling provides good user experience

### Common Issues and Solutions

**Issue**: Refresh token cookie not sent with requests
- **Solution**: Ensure `credentials: 'include'` in fetch/axios config
- **Solution**: Verify CORS `allow_credentials: true` on backend

**Issue**: Access token expires frequently
- **Solution**: Implement proactive refresh (refresh 1-2 min before expiration)
- **Solution**: Check token expiration time calculation

**Issue**: State validation fails
- **Solution**: Ensure state stored and retrieved correctly from sessionStorage
- **Solution**: Verify state not cleared prematurely
- **Solution**: Check state token expiration (10 minutes default)

**Issue**: Code verifier mismatch
- **Solution**: Ensure code_verifier stored and retrieved correctly
- **Solution**: Verify code_verifier not modified between initiate and callback
- **Solution**: Check code_verifier format (43-128 characters, URL-safe)

### Next Steps

After implementing frontend integration:
1. Test all authentication flows thoroughly
2. Monitor error rates and token refresh frequency
3. Consider adding token refresh retry logic
4. Implement user session timeout warnings
5. Add loading states during authentication flows
6. Consider adding "Remember me" functionality (longer refresh token duration)

---

## Quick Reference Flow Charts

### A) Login (OAuth + PKCE Option A)

```
User clicks "Sign in with Google"
        |
        v
Frontend generates code_verifier + code_challenge
        |
        v
Frontend calls GET /auth/initiate (code_challenge)
        |
        v
Backend returns authorization_url + signed state
        |
        v
Frontend stores {state, code_verifier} (sessionStorage)
        |
        v
Frontend redirects user to Google
        |
        v
Google redirects back with {code, state}
        |
        v
Frontend sends {code, state, code_verifier} to backend callback
        |
        v
Backend validates state + exchanges code (uses code_verifier)
        |
        v
Backend sets refresh_token cookie + returns access_token
        |
        v
Frontend stores access_token (memory)
```

### B) App Startup (Silent Re-Auth After Browser Restart)

```
User opens app (no access_token in memory)
        |
        v
Frontend calls POST /auth/refresh
        |
        v
Browser sends refresh_token cookie automatically
        |
        v
Backend validates + rotates refresh token
        |
        v
Backend returns new access_token (cookie refreshed)
        |
        v
Frontend stores access_token (memory) and continues
```

### C) Token Refresh on 401 (Normal Operation)

```
API request -> 401 Unauthorized (access token expired)
        |
        v
Frontend calls POST /auth/refresh
        |
        v
Backend returns new access_token (and rotates cookie)
        |
        v
Frontend retries the original request
```
