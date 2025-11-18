import {API_BASE_URL, API_ENDPOINTS} from './config';

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
      
      // Try to parse JSON error response, fallback to text if parsing fails
      const contentType = response.headers.get('content-type');
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } else {
          // Non-JSON response (HTML, plain text, etc.)
          const errorText = await response.text();
          if (errorText) {
            errorMessage = `Server error: ${errorText.substring(0, 200)}`;
          }
        }
      } catch (parseError) {
        // If parsing fails, keep the default error message
        console.warn('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

/**
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
      console.error('Failed to fetch matches:', error);
      throw error;
  }
}
