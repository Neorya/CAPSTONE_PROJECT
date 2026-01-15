/**
 * Authentication Service
 * Handles authentication state and token validation
 */

import { API_BASE_URL } from "./config";

/**
 * Auth enable/disable controls
 *
 * - Build-time default is controlled by REACT_APP_AUTH_ENABLED.
 * - Runtime override is stored in localStorage to allow quick toggling in dev/tests.
 *
 * IMPORTANT: CRA/Vite style env vars are baked at build time; changing them requires rebuild.
 */
const AUTH_ENABLED_OVERRIDE_KEY = "auth_enabled_override";
const AUTH_ENABLED_DEFAULT = String(process.env.REACT_APP_AUTH_ENABLED || "false") === "true";

/**
 * Dev mode flag key in localStorage
 */
const DEV_MODE_KEY = "dev_mode_bypass";

/**
 * Determine whether authentication is enabled.
 * If auth is disabled, route guards and token validation will be bypassed.
 */
export const isAuthEnabled = () => {
  const override = localStorage.getItem(AUTH_ENABLED_OVERRIDE_KEY);
  if (override === "true") return true;
  if (override === "false") return false;
  return AUTH_ENABLED_DEFAULT;
};

/**
 * Persist a runtime override for whether auth is enabled.
 * This is useful for local development and test environments.
 */
export const setAuthEnabledOverride = (enabled) => {
  localStorage.setItem(AUTH_ENABLED_OVERRIDE_KEY, enabled ? "true" : "false");
};

/**
 * Clear the runtime override and fall back to the build-time env default.
 */
export const clearAuthEnabledOverride = () => {
  localStorage.removeItem(AUTH_ENABLED_OVERRIDE_KEY);
};

/**
 * Check if dev mode bypass is enabled
 * Dev mode must be explicitly enabled via localStorage flag
 */
export const isDevModeEnabled = () => {
  return localStorage.getItem(DEV_MODE_KEY) === "true";
};

/**
 * Enable dev mode bypass (skip authentication)
 */
export const enableDevMode = () => {
  localStorage.setItem(DEV_MODE_KEY, "true");
  // Set a dummy token so hasToken() returns true
  localStorage.setItem("token", "dev_mode_token");
};

/**
 * Disable dev mode bypass
 */
export const disableDevMode = () => {
  localStorage.removeItem(DEV_MODE_KEY);
  if (localStorage.getItem("token") === "dev_mode_token") {
    localStorage.removeItem("token");
  }
};

/**
 * Check if user has a token stored
 */
export const hasToken = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get the stored access token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Remove the stored token (logout)
 */
export const removeToken = () => {
  localStorage.removeItem("token");
};

/**
 * Store the access token
 */
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Validate the current token with the backend
 * Returns true if token is valid, false otherwise
 * In dev mode, returns true if dev mode is enabled
 */
export const validateToken = async () => {
  // Global auth kill-switch (used in tests / local development)
  if (!isAuthEnabled()) {
    return true;
  }

  // Check if dev mode is enabled
  // SECURITY NOTE: This bypasses backend token validation when dev mode is enabled.
  // Any code path that relies on validateToken for authorization will be circumvented.
  // Ensure dev mode is only enabled in controlled development environments.
  if (isDevModeEnabled()) {
    const token = getToken();
    if (token === "dev_mode_token") {
      console.warn("⚠️ DEV MODE: Authentication bypassed");
      return true;
    }
  }

  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for refresh token
    });

    if (response.ok) {
      return true;
    }

    // If 401, try to refresh the token
    if (response.status === 401) {
      return await refreshToken();
    }

    return false;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

/**
 * Refresh the access token using the refresh token cookie
 */
export const refreshToken = async () => {
  // If auth is disabled, skip refresh attempts.
  if (!isAuthEnabled()) {
    return true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for refresh token
    });

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        setToken(data.access_token);
        return true;
      }
    }

    // Refresh failed, remove token
    removeToken();
    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    removeToken();
    return false;
  }
};

/**
 * Logout the user by revoking the refresh token
 */
export const logout = async () => {
  try {
    // If auth is disabled, just clear local state (no backend calls).
    if (!isAuthEnabled()) {
      return;
    }

    // Only call backend logout if not in dev mode
    const token = getToken();
    if (token !== "dev_mode_token") {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for refresh token
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Always remove token and disable dev mode
    disableDevMode();
    removeToken();
  }
};
