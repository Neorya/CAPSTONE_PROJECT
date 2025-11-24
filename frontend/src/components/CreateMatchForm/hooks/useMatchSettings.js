import { useState, useEffect } from 'react';
import { fetchMatchSettings } from '../../../services/matchSettingsService';
import { MATCH_SETTINGS_STATUS, ERROR_MESSAGES, INFO_MESSAGES } from '../constants';
import { isNetworkError } from '../../../utils/errorUtils';

/**
 * Custom hook for fetching and managing match settings
 * Handles loading state, error handling, and empty state notifications
 * 
 * @param {Function} showAlert - Function to display alerts to the user
 * @returns {Object} Match settings state
 * @returns {Array} matchSettings - List of available match settings
 * @returns {boolean} isLoading - Loading state indicator
 * @returns {string|null} error - Error message if fetch failed
 */
export const useMatchSettings = (showAlert) => {
  const [matchSettings, setMatchSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const settings = await fetchMatchSettings(MATCH_SETTINGS_STATUS);
        setMatchSettings(settings);

        if (settings.length === 0) {
          showAlert('info', INFO_MESSAGES.NO_READY_SETTINGS);
        }
      } catch (err) {
        let errorMessage;
        
        if (isNetworkError(err)) {
          errorMessage = ERROR_MESSAGES.CONNECTION_ERROR;
        } else if (err.response) {
          errorMessage = `${ERROR_MESSAGES.LOAD_SETTINGS_ERROR}: Server returned ${err.response.status}`;
        } else if (err.message) {
          errorMessage = `${ERROR_MESSAGES.LOAD_SETTINGS_ERROR}: ${err.message}`;
        } else {
          errorMessage = ERROR_MESSAGES.LOAD_SETTINGS_ERROR;
        }

        setError(errorMessage);
        showAlert('error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatchSettings();
    // showAlert is stable due to useCallback in useAlert hook
    // This dependency is intentional and won't cause unnecessary re-renders
  }, [showAlert]);

  return {
    matchSettings,
    isLoading,
    error
  };
};

