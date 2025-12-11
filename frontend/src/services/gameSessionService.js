import { API_BASE_URL, API_ENDPOINTS } from "./config";

/**
 * Creates a new game session with the specified match IDs, creator ID, name, and start date.
 *
 * @param {Array<string|number>} matchIds - The IDs of the matches to include in the session.
 * @param {string|number} creatorId - The ID of the user creating the session.
 * @param {string} name - The name of the game session.
 * @param {string} startDate - The start date and time of the session (ISO format).
 * @returns {Promise<Object>} A promise that resolves to the created game session object.
 */
export async function createGameSession(matchIds, creatorId, name, startDate) {
  try {
    const url = new URL(API_ENDPOINTS.GAME_SESSIONS, API_BASE_URL);
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        match_id: matchIds,
        creator_id: creatorId,
        name: name,
        start_date: startDate,
      }),
    });
    if (!res.ok) {
      let errorMessage = `Failed to create game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getGameSessionsByCreator(creatorId) {
  try {
    const url = new URL(`${API_ENDPOINTS.GAME_SESSIONS}/by_creator/${creatorId}`, API_BASE_URL);
    const res = await fetch(url.toString());
    if (!res.ok) {
      let errorMessage = `Failed to fetch game sessions: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Deletes a game session with the specified game ID.
 *
 * @param {string|number} gameId - The ID of the game session to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful.
 */
export async function deleteGameSession(gameId) {
  try {
    const url = new URL(`${API_ENDPOINTS.GAME_SESSIONS}/${gameId}`, API_BASE_URL);
    const res = await fetch(url.toString(), {
      method: "DELETE",
    });
    if (!res.ok) {
      let errorMessage = `Failed to delete game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function cloneGameSession(gameId) {
  try {
    const url = new URL(`${API_ENDPOINTS.GAME_SESSIONS}/${gameId}/clone`, API_BASE_URL);
    const res = await fetch(url.toString(), {
      method: "POST",
    });
    if (!res.ok) {
      let errorMessage = `Failed to clone game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Updates an existing game session with the specified updates.
 *
 * @param {string|number} gameId - The ID of the game session to update.
 * @param {Object} updates - An object containing the fields to update in the game session.
 * @returns {Promise<Object>} A promise that resolves to the updated game session object.
 */
export async function updateGameSession(gameId, updates) {
  try {
    const url = new URL(`${API_ENDPOINTS.GAME_SESSIONS}/${gameId}`, API_BASE_URL);
    const res = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      let errorMessage = `Failed to update game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Fetches a game session by its ID.
 *
 * @param {string|number} gameId - The ID of the game session to fetch.
 * @returns {Promise<Object>} A promise that resolves to the game session object.
 */
export async function getGameSessionById(gameId) {
  try {
    const url = new URL(`${API_ENDPOINTS.GAME_SESSIONS}/${gameId}`, API_BASE_URL);
    const res = await fetch(url.toString());
    if (!res.ok) {
      let errorMessage = `Failed to fetch game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors, use statusText
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw new Error(`Failed to create game session: ${err.message}`);
  }
}
