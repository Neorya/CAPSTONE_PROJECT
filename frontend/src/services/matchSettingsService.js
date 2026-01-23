import { API_BASE_URL } from "./config";
import { apiFetch } from "./api";



/**
 * Fetch match settings with optional filtering
 * @param {string} filter - Filter value ('Ready', 'Draft', or 'All')
 * @returns {Promise<Array>} Array of match settings
 */
export async function fetchMatchSettings(filter) {
  let isReady;
  if (filter === "Ready") isReady = true;
  else if (filter === "Draft") isReady = false;
  const url = new URL("/api/match-settings", API_BASE_URL);
  if (isReady !== undefined) url.searchParams.set("is_ready", String(isReady));
  const res = await apiFetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`Failed to fetch match settings: ${res.statusText}`);
  return res.json();
}

/**
 * Fetch a single match setting by ID
 * @param {number} matchSetId - Match setting ID
 * @returns {Promise<Object>} Match setting object
 */
export async function fetchMatchSetting(matchSetId) {
  const url = new URL(`/api/match-settings/${matchSetId}`, API_BASE_URL);
  const res = await apiFetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`Failed to fetch match setting: ${res.statusText}`);
  return res.json();
}

/**
 * Create a new match setting (saved as draft)
 * @param {Object} data - Match setting data
 * @returns {Promise<Object>} Created match setting
 */
export async function createMatchSetting(data) {
  const url = new URL("/api/match-settings", API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to create match setting");
  }
  return res.json();
}

/**
 * Update an existing match setting
 * @param {number} matchSetId - Match setting ID
 * @param {Object} data - Updated match setting data
 * @returns {Promise<Object>} Updated match setting
 */
export async function updateMatchSetting(matchSetId, data) {
  const url = new URL(`/api/match-settings/${matchSetId}`, API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to update match setting");
  }
  return res.json();
}

/**
 * Publish a match setting (validates tests first)
 * @param {number} matchSetId - Match setting ID
 * @returns {Promise<Object>} Published match setting
 */
export async function publishMatchSetting(matchSetId) {
  const url = new URL(`/api/match-settings/${matchSetId}/publish`, API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "POST",
    // Headers handled by apiFetch
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to publish match setting");
  }
  return res.json();
}

/**
 * Clone an existing match setting
 * @param {number} matchSetId - Match setting ID to clone
 * @returns {Promise<Object>} Cloned match setting
 */
export async function cloneMatchSetting(matchSetId) {
  const url = new URL(`/api/match-settings/${matchSetId}/clone`, API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "POST",
    // Headers handled by apiFetch
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to clone match setting");
  }
  return res.json();
}

/**
 * Try/validate code against tests without saving
 * @param {Object} data - { reference_solution, language, tests }
 * @returns {Promise<Object>} Validation results
 */
export async function tryMatchSetting(data) {
  const url = new URL("/api/match-settings/try", API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to validate code");
  }
  return res.json();
}

/**
 * Delete a test case from a match setting
 * @param {number} matchSetId - Match setting ID
 * @param {number} testId - Test ID to delete
 * @returns {Promise<void>}
 */
export async function deleteTest(matchSetId, testId) {
  const url = new URL(`/api/match-settings/${matchSetId}/tests/${testId}`, API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "DELETE",
    // Headers handled by apiFetch
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to delete test");
  }
}

/**
 * Delete a match setting
 * @param {number} matchSetId - Match setting ID
 * @returns {Promise<void>}
 */
export async function deleteMatchSetting(matchSetId) {
  const url = new URL(`/api/match-settings/${matchSetId}`, API_BASE_URL);
  const res = await apiFetch(url.toString(), {
    method: "DELETE",
    // Headers handled by apiFetch
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to delete match setting");
  }
}
