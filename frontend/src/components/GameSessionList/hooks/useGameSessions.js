import { useState, useEffect, useCallback } from 'react';
import {
  getGameSessionsByCreator,
  deleteGameSession,
  cloneGameSession,
  updateGameSession,
} from '../../../services/gameSessionService';
import {
  CURRENT_TEACHER_ID,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../constants';

/**
 * Custom hook for managing game sessions
 * Handles fetching, cloning, deleting, and updating game sessions
 * 
 * @param {Function} showAlert - Function to display error alerts
 * @param {Function} showSuccess - Function to display success messages
 * @returns {Object} Session state and control functions
 */
export const useGameSessions = (showAlert, showSuccess) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all game sessions for the current teacher
   */
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGameSessionsByCreator(CURRENT_TEACHER_ID);
      const sortedSessions = data.sort((a, b) => b.game_id - a.game_id);
      setSessions(sortedSessions);
    } catch (err) {
      showAlert('error', ERROR_MESSAGES.LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  /**
   * Clones a game session
   * @param {Object} session - Session to clone
   */
  const handleCloneSession = useCallback(async (session) => {
    try {
      setLoading(true);
      await cloneGameSession(session.game_id);
      showSuccess(SUCCESS_MESSAGES.CLONED);
      await fetchSessions();
    } catch (err) {
      showAlert('error', ERROR_MESSAGES.CLONE_FAILED);
    } finally {
      setLoading(false);
    }
  }, [showAlert, showSuccess, fetchSessions]);

  /**
   * Deletes a game session
   * @param {number} id - Session ID to delete
   */
  const handleDeleteSession = useCallback(async (id) => {
    try {
      setLoading(true);
      await deleteGameSession(id);
      setSessions(prev => prev.filter(s => s.game_id !== id));
      showSuccess(SUCCESS_MESSAGES.DELETED);
    } catch (err) {
      showAlert('error', ERROR_MESSAGES.DELETE_FAILED);
    } finally {
      setLoading(false);
    }
  }, [showAlert, showSuccess]);

  /**
   * Updates a game session
   * @param {number} id - Session ID to update
   * @param {Object} updates - Updates to apply
   * @returns {Promise<boolean>} True if update succeeded
   */
  const handleUpdateSession = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      await updateGameSession(id, updates);
      setSessions(prev => prev.map(s =>
        s.game_id === id ? { ...s, ...updates } : s
      ));
      showSuccess(SUCCESS_MESSAGES.UPDATED);
      return true;
    } catch (err) {
      showAlert('error', ERROR_MESSAGES.UPDATE_FAILED);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showAlert, showSuccess]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    fetchSessions,
    cloneSession: handleCloneSession,
    deleteSession: handleDeleteSession,
    updateSession: handleUpdateSession,
  };
};
