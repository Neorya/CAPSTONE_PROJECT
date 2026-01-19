/**
 * Solution Results Service
 * Handles API calls for student solution test results and scoring
 */

import { apiFetch } from './api';
import { API_BASE_URL } from './config';

/**
 * Get all test results for a student's solution
 * @param {number} solutionId - ID of the student solution
 * @returns {Promise<Object>} Solution test results with code, tests, and score
 */
export const getSolutionTestResults = async (solutionId) => {
    const url = `${API_BASE_URL}/api/student-results/tests/${solutionId}`;
    const response = await apiFetch(url);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch solution results: ${response.statusText}`);
    }

    return response.json();
};

/**
 * Get score breakdown for a student in a game session
 * @param {number} studentId - ID of the student
 * @param {number} gameId - ID of the game session
 * @returns {Promise<Object>} Student's score breakdown across all matches
 */
export const getStudentGameScore = async (studentId, gameId) => {
    const url = `${API_BASE_URL}/api/student-results/score/student/${studentId}/game/${gameId}`;
    const response = await apiFetch(url);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch student score: ${response.statusText}`);
    }

    return response.json();
};

/**
 * Get the student's solution ID for a specific game session
 * @param {number} studentId - ID of the student
 * @param {number} gameId - ID of the game session
 * @returns {Promise<Object>} Object containing solution_id
 */
export const getStudentSolutionId = async (studentId, gameId) => {
    const url = `${API_BASE_URL}/api/student-results/solution/student/${studentId}/game/${gameId}`;
    const response = await apiFetch(url);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to fetch solution ID: ${response.statusText}`);
    }

    return response.json();
};
