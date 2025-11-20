import { useState, useCallback } from 'react';

/**
 * hook for managing match setting details popup state
 * 
 * @returns {Object} Popup state and handlers
 * @returns {Object|null} selectedMatchSetting - Currently selected match setting
 * @returns {boolean} isPopupVisible - Visibility state of the popup
 * @returns {Function} openPopup - Function to open popup with specific setting
 * @returns {Function} closePopup - Function to close popup
 */
export const useMatchSettingDetails = () => {
  const [selectedMatchSetting, setSelectedMatchSetting] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const openPopup = useCallback((matchSetting) => {
    setSelectedMatchSetting(matchSetting);
    setIsPopupVisible(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupVisible(false);
    setSelectedMatchSetting(null);
  }, []);

  return {
    selectedMatchSetting,
    isPopupVisible,
    openPopup,
    closePopup
  };
};
