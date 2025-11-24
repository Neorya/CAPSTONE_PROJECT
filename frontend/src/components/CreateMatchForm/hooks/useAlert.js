import { useState, useCallback } from 'react';

/**
 * Custom hook for managing alert state
 * Provides a stable interface for showing/hiding alerts with type and message
 * Uses useCallback to prevent unnecessary re-renders in dependent components
 * 
 * @returns {Object} Alert state and control functions
 * @returns {Object} alert - Current alert state {visible, type, message}
 * @returns {Function} showAlert - Stable function to display an alert
 * @returns {Function} hideAlert - Stable function to hide the alert
 * @returns {Function} resetAlert - Stable function to reset the alert to initial state
 */
export const useAlert = () => {
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });

  // Use useCallback to ensure stable function reference
  // This prevents dependent useEffects from re-running unnecessarily
  const showAlert = useCallback((type, message) => {
    setAlert({ visible: true, type, message });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  const resetAlert = useCallback(() => {
    setAlert({ visible: false, type: 'success', message: '' });
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
    resetAlert
  };
};

