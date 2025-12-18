
import { API_BASE_URL, API_ENDPOINTS } from "./config";
import { apiFetch } from "./api";

/**
 * Allows a student to join an available game session.
 *
 * @param {number} studentId - The ID of the student joining the session.
 * @param {number} gameId - The ID of the game session to join.
 * @returns {Promise<Object>} A promise that resolves to the response data confirming the student has joined the session.
 * @throws {Error} Throws an error if the join request fails.
 */
export async function joinGameSession(studentId, gameId) {
  try {
    const url = new URL(API_ENDPOINTS.JOIN_GAME, API_BASE_URL);
    const res = await apiFetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        game_id: gameId
      }),
    });
    if (!res.ok) {
      let errorMessage = "Failed to join game session.";
      try {
        const errorData = await res.json();

        // if the error response has a 'detail' field, use it
        if (errorData?.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

/**
 * Fetches the next available game session from the server.
 *
 * @returns {Promise<Object>} A promise that resolves to the available game session data.
 * @throws {Error} Throws an error if the fetch request fails.
 */
export async function getAvailableGame() {
  try {
    const url = new URL(API_ENDPOINTS.GET_LAST_GAME, API_BASE_URL);

    const response = await apiFetch(url.toString());

    if (!response.ok) {
      let errorMessage = "Failed to fetch game session.";
      try {
        const errorData = await response.json();

        // if the error response has a 'detail' field, use it
        if (errorData?.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Checks if a student has already joined a specific game session.
 *
 * @param {number} studentId - The ID of the student to check.
 * @param {number} gameId - The ID of the game session to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the student has joined the session, false otherwise.
 * @throws {Error} Throws an error if the request fails with more detailed error information when available.
 */
export async function hasStudentAlreadyJoinedSession(studentId, gameId) {
  try {
    const url = new URL(`${API_ENDPOINTS.HAS_STUDENT_JOINED}/${studentId}/${gameId}`, API_BASE_URL);

    const response = await apiFetch(url.toString());

    if (!response.ok) {
      let errorMessage = 'Failed to check student session.';
      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          errorMessage = errorData.detail;
        }
      } catch (jsonErr) {
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.joined;
  } catch (error) {
    throw error;
  }
}
