/**
 * API Configuration
 * Central configuration for backend API communication
 */

// Backend API base URL
// Use environment variable if available, otherwise default to localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  MATCH_SETTINGS: '/api/match-settings',
  MATCHES: '/api/matches',
  GAME_SESSIONS: '/api/game_session',
  JOIN_GAME: '/api/join_game_session',
  GET_LAST_GAME: '/api/get_next_upcoming_game',
  HAS_STUDENT_JOINED: '/api/has_student_joined_game'
};

