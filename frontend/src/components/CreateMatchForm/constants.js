/**
 * Constants for CreateMatchForm component
 * Centralized configuration for form validation and default values
 */

// Default values
export const DEFAULT_CREATOR_ID = 1;
export const DEFAULT_REVIEW_NUMBER = 4;

// Validation constraints
export const MIN_REVIEWERS = 1;
export const MAX_REVIEWERS = 10;
export const MIN_TITLE_LENGTH = 10;
export const MAX_TITLE_LENGTH = 150;
export const MIN_DURATION = 1;

// Form field names
export const REQUIRED_FIELDS = [
  'title',
  'difficulty_level',
  'review_number',
  'duration_phase1',
  'duration_phase2'
];

// Difficulty levels configuration
export const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Easy' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Hard' },
];

// Match settings status
export const MATCH_SETTINGS_STATUS = 'Ready';

// Error messages
export const ERROR_MESSAGES = {
  NO_MATCH_SETTING: 'You should select a match setting to create a match',
  CONNECTION_ERROR: 'Cannot connect to the server. Please make sure the backend is running (docker-compose up).',
  LOAD_SETTINGS_ERROR: 'Failed to load match settings',
  CREATE_MATCH_ERROR: 'Failed to create match. Please try again.',
};

// Info messages
export const INFO_MESSAGES = {
  NO_READY_SETTINGS: 'No ready match settings available. Please create and mark a match setting as ready first.',
};

