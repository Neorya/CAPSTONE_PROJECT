/**
 * Match Service
 * Handles all match-related API communications
 */

import { API_BASE_URL, API_ENDPOINTS } from './config';

/**
 * Fetch match settings from the backend
 * @param {boolean} isReady - Filter by ready status (default: true)
 * @returns {Promise<Array>} Array of match settings
 */
export const fetchMatchSettings = async (isReady = true) => {
  try {
    const url = `${API_BASE_URL}${API_ENDPOINTS.MATCH_SETTINGS}?is_ready=${isReady}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch match settings: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map backend format to frontend format
    return data.map(setting => ({
      id: setting.match_set_id,
      name: setting.title,
      description: setting.description,
      status: setting.is_ready ? 'Ready' : 'Draft',
      creator_id: setting.creator_id,
    }));
  } catch (error) {
    console.error('Error fetching match settings:', error);
    throw error;
  }
};

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
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to create match: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

