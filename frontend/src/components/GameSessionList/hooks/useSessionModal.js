import { useState, useCallback } from 'react';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { getMatches } from '../../../services/matchService';

/**
 * Custom hook for managing session modal state
 * Handles view/edit modes and form state for the session detail modal
 * Now includes match selection management for edit mode
 * 
 * @returns {Object} Modal state and control functions
 */
export const useSessionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('view'); // 'view' or 'edit'
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionMatches, setSessionMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [form] = Form.useForm();

  // New state for edit mode match selection
  const [allMatches, setAllMatches] = useState([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState([]);
  const [allMatchesLoading, setAllMatchesLoading] = useState(false);

  /**
   * Populates form with session data
   * @param {Object} session - Session data to populate
   */
  const populateForm = useCallback((session) => {
    form.setFieldsValue({
      name: session.name,
      start_date: dayjs(session.start_date),
      duration_phase1: session.duration_phase1,
      duration_phase2: session.duration_phase2
    });
  }, [form]);

  /**
   * Fetches all available matches for selection
   */
  const fetchAllMatches = useCallback(async () => {
    try {
      setAllMatchesLoading(true);
      const matches = await getMatches();
      setAllMatches(matches);
      return matches;
    } catch (error) {
      console.error('Failed to fetch all matches:', error);
      setAllMatches([]);
      return [];
    } finally {
      setAllMatchesLoading(false);
    }
  }, []);

  /**
   * Fetches match details for the session's match IDs (view mode)
   * @param {Array<number>} matchIds - Array of match IDs
   */
  const fetchSessionMatches = useCallback(async (matchIds) => {
    if (!matchIds || matchIds.length === 0) {
      setSessionMatches([]);
      return;
    }

    try {
      setMatchesLoading(true);
      const allMatchesData = await getMatches();
      // Filter matches that belong to this session
      const sessionMatchDetails = allMatchesData.filter(
        match => matchIds.includes(match.match_id)
      );
      setSessionMatches(sessionMatchDetails);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setSessionMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  /**
   * Opens modal in view mode
   * @param {Object} session - Session to view
   */
  const openForView = useCallback((session) => {
    setMode('view');
    setSelectedSession(session);
    populateForm(session);
    setIsOpen(true);
    // Fetch match details for this session
    fetchSessionMatches(session.match_id);
    // Clear edit mode state
    setAllMatches([]);
    setSelectedMatchIds([]);
  }, [populateForm, fetchSessionMatches]);

  /**
   * Opens modal in edit mode
   * @param {Object} session - Session to edit
   */
  const openForEdit = useCallback(async (session) => {
    setMode('edit');
    setSelectedSession(session);
    populateForm(session);
    setIsOpen(true);
    // Clear view mode state
    setSessionMatches([]);
    // Set initial selected match IDs from session
    setSelectedMatchIds(session.match_id || []);
    // Fetch all available matches for selection
    await fetchAllMatches();
  }, [populateForm, fetchAllMatches]);

  /**
   * Switches from view mode to edit mode
   */
  const switchToEdit = useCallback(async () => {
    setMode('edit');
    // Transfer current session match IDs to selection
    if (selectedSession?.match_id) {
      setSelectedMatchIds(selectedSession.match_id);
    }
    // Clear view mode matches
    setSessionMatches([]);
    // Fetch all matches for selection
    await fetchAllMatches();
  }, [selectedSession, fetchAllMatches]);

  /**
   * Updates the selected match IDs
   * @param {Array<number>} matchIds - New array of selected match IDs
   */
  const updateSelectedMatchIds = useCallback((matchIds) => {
    setSelectedMatchIds(matchIds);
  }, []);

  /**
   * Closes the modal and resets state
   */
  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedSession(null);
    setSessionMatches([]);
    setAllMatches([]);
    setSelectedMatchIds([]);
    form.resetFields();
  }, [form]);

  /**
   * Gets form values for submission (including match IDs)
   * @returns {Promise<Object>} Validated form values with match IDs
   */
  const getFormValues = useCallback(async () => {
    const values = await form.validateFields();
    return {
      name: values.name,
      start_date: values.start_date.format('YYYY-MM-DD HH:mm:ss'),
      match_id: selectedMatchIds,
      duration_phase1: values.duration_phase1,
      duration_phase2: values.duration_phase2
    };
  }, [form, selectedMatchIds]);

  /**
   * Validates if form can be submitted
   * @returns {boolean} True if form is valid
   */
  const isFormValid = useCallback(() => {
    return selectedMatchIds.length > 0;
  }, [selectedMatchIds]);

  return {
    // Modal state
    isOpen,
    mode,
    selectedSession,
    form,

    // View mode state
    sessionMatches,
    matchesLoading,

    // Edit mode state
    allMatches,
    selectedMatchIds,
    allMatchesLoading,

    // Actions
    openForView,
    openForEdit,
    switchToEdit,
    close,
    getFormValues,
    updateSelectedMatchIds,
    isFormValid,
  };
};
