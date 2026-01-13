import { API_BASE_URL, API_ENDPOINTS } from "./config";
import { apiFetch } from "./api";

/**
 * Fetches the leaderboard with pagination.
 *
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of entries per page
 * @param {number|null} studentId - Optional student ID for current user rank info
 * @returns {Promise<Object>} A promise that resolves to the leaderboard data
 */
export async function getLeaderboard(page = 1, pageSize = 10, studentId = null) {
    try {
        const url = new URL(API_ENDPOINTS.LEADERBOARD, API_BASE_URL);
        url.searchParams.append("page", page);
        url.searchParams.append("page_size", pageSize);
        if (studentId !== null) {
            url.searchParams.append("student_id", studentId);
        }

        const res = await apiFetch(url.toString());
        if (!res.ok) {
            let errorMessage = `Failed to fetch leaderboard: ${res.statusText}`;
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
