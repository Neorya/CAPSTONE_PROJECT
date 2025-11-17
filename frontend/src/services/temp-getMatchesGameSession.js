import {API_BASE_URL, API_ENDPOINTS} from './config';

// Temporary function to get matches for a game session (to integrate with matchService.js)

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