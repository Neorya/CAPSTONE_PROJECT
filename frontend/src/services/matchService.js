import { API_BASE_URL, API_ENDPOINTS } from './config';

/**
 * Create a new match
 * @param {Object} matchData - Match creation data
 * @param {string} matchData.title - Match title
 * @param {number} matchData.match_set_id - Match setting ID
 * @param {number} matchData.creator_id - Teacher/creator ID
 * @param {number} matchData.difficulty_level - Difficulty level (1=Easy, 2=Medium, 3=Hard)
 * @param {number} matchData.review_number - Number of reviewers
 * @param {number} matchData.duration_phase1 - Duration of first phase in minutes
 * @param {number} matchData.duration_phase2 - Duration of second phase in minutes
 * @returns {Promise<Object>} Created match object
 */
export const createMatch = async (matchData) => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.MATCHES}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });

    if (!response.ok) {
      let errorMessage = `Failed to create match: ${response.statusText}`;
      const status = response.status;
      const contentType = response.headers.get('content-type');

      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          const serverMessage = errorData.detail || errorData.message;

          if (status === 400) {
            errorMessage = serverMessage || 'Invalid match data. Please check your inputs.';
          } else if (status === 404) {
            errorMessage = 'The selected match setting was not found. It may have been deleted.';
          } else if (status === 409) {
            errorMessage = serverMessage || 'A match with this configuration already exists.';
          } else if (status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = serverMessage || `Failed to create match: ${response.statusText}`;
          }
        } else {
          const errorText = await response.text();
          if (errorText && status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '') || `Failed to create match: ${response.statusText}`;
          }
        }
      } catch (parseError) {
        if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (status >= 400) {
          errorMessage = 'Invalid request. Please check your inputs.';
        } else {
          errorMessage = `Failed to create match: ${response.statusText}`;
        }
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * TODO: Delete this function after removal of all the usages of it
 * Fetch the list of matches
 * @returns {Promise<Array<Object>>} List of match objects
 */
export const getMatches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MATCHES}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching matches: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the list of matches
  } catch (error) {
    throw error;
  }
}
