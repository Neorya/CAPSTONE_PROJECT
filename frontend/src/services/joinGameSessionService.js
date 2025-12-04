
import { API_BASE_URL, API_ENDPOINTS } from "./config";

export async function joiGameSession(gameId, studentId) {
  try {
    const url = new URL(API_ENDPOINTS.JOIN_GAME, API_BASE_URL);
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game_id: gameId,
        student_id: studentId
      }),
    });
    if (!res.ok) {
      let errorMessage = `Failed to join game session: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMessage = `Failed to join game session: ${errorData.message}`;
        }
      } catch (jsonErr) {
        // Ignore JSON parse errors, use statusText
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    throw new Error(`Failed to join game session: ${err.message}`);
  }
}

export async function getAvailableGame() {
  try {
    const url = new URL(API_ENDPOINTS.GET_LAST_GAME, API_BASE_URL);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Error fetching game session: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
