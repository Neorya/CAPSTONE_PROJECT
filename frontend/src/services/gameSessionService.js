import { API_BASE_URL, API_ENDPOINTS } from "./config";

/**
 * Creates a new game session with the specified match IDs and creator ID.
 *
 * @param {Array<string|number>} matchIds - The IDs of the matches to include in the session.
 * @param {string|number} creatorId - The ID of the user creating the session.
 * @returns {Promise<Object>} A promise that resolves to the created game session object.
 */
export async function createGameSession(matchIds, creatorId) {
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
      }),
    });
    if (!res.ok) {
      let errorMessage = `Failed to create game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMessage = `Failed to create game session: ${errorData.message}`;
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
