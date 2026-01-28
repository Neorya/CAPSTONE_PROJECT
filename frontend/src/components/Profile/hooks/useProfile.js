import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, updateUserProfile } from '../../../services/userService';
import { getStudentBadges } from '../../../services/badgeService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

/**
 * Custom hook for managing profile data and operations
 * Handles fetching profile, badges, and updating profile
 * 
 * @param {Function} showSuccess - Function to display success messages
 * @param {Function} showError - Function to display error messages
 * @returns {Object} Profile state and control functions
 */
export const useProfile = (showSuccess, showError) => {
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setProfile(data);

      if (data.role === 'student') {
        const badgeData = await getStudentBadges(data.user_id);
        setBadges(badgeData);
      }
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.LOAD_FAILED);
      showError?.(err.message || ERROR_MESSAGES.LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  /**
   * Updates user profile and refreshes the full profile data
   * @param {Object} values - Updated profile values
   * @returns {Promise<boolean>} True if update succeeded
   */
  const handleUpdateProfile = useCallback(async (values) => {
    try {
      await updateUserProfile(values);
      // Refresh the full profile to get computed fields like rank
      await fetchProfile();
      showSuccess?.(SUCCESS_MESSAGES.UPDATED);
      return true;
    } catch (err) {
      showError?.(err.message || ERROR_MESSAGES.UPDATE_FAILED);
      return false;
    }
  }, [showSuccess, showError, fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    badges,
    loading,
    error,
    updateProfile: handleUpdateProfile,
    refreshProfile: fetchProfile,
  };
};

export default useProfile;
