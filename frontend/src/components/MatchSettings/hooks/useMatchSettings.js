import { useState, useEffect, useCallback } from 'react';
import {
    fetchMatchSettings as fetchMatchSettingsService,
    updateMatchSetting as updateMatchSettingService,
    deleteMatchSetting as deleteMatchSettingService,
    cloneMatchSetting as cloneMatchSettingService,
    publishMatchSetting as publishMatchSettingService,
} from '../../../services/matchSettingsService';

const ERROR_MESSAGES = {
    LOAD_FAILED: 'Failed to load match settings',
    UPDATE_FAILED: 'Failed to update match setting',
    DELETE_FAILED: 'Failed to delete match setting',
    CLONE_FAILED: 'Failed to clone match setting',
    PUBLISH_FAILED: 'Failed to publish match setting',
};

const SUCCESS_MESSAGES = {
    UPDATED: 'Match setting updated successfully',
    DELETED: 'Match setting deleted successfully',
    CLONED: 'Match setting cloned successfully',
    PUBLISHED: 'Match setting published successfully',
};

/**
 * Custom hook for managing match settings CRUD operations
 * Handles fetching, updating, deleting, cloning, and publishing match settings
 * 
 * @param {Function} showAlert - Function to display error alerts
 * @param {Function} showSuccess - Function to display success messages
 * @returns {Object} Match settings state and control functions
 */
export const useMatchSettings = (showAlert, showSuccess) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
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

    /**
     * Fetches all match settings based on current filter
     */
    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchMatchSettingsService(filter);
            const formatted = data.map((item) => ({
                id: item.match_set_id,
                name: item.title,
                description: item.description,
                tests: item.tests,
                reference_solution: item.reference_solution,
                student_code: item.student_code,
                function_name: item.function_name,
                function_type: item.function_type,
                function_inputs: item.function_inputs,
                language: item.language,
                creator_id: item.creator_id,
                status: item.is_ready ? 'Ready' : 'Draft',
                is_ready: item.is_ready,
            }));
            setItems(formatted);
        } catch (err) {
            console.error('Error fetching match settings:', err);
            showAlert?.('error', ERROR_MESSAGES.LOAD_FAILED);
        } finally {
            setLoading(false);
        }
    }, [filter, showAlert]);

    /**
     * Updates a match setting
     * @param {number} id - Match setting ID to update
     * @param {Object} updates - Updates to apply
     * @returns {Promise<boolean>} True if update succeeded
     */
    const handleUpdate = useCallback(async (id, updates) => {
        try {
            setLoading(true);
            await updateMatchSettingService(id, updates);
            await fetchItems(); // Refresh to get updated data
            showSuccess?.(SUCCESS_MESSAGES.UPDATED);
            return true;
        } catch (err) {
            console.error('Error updating match setting:', err);
            showAlert?.('error', err.message || ERROR_MESSAGES.UPDATE_FAILED);
            return false;
        } finally {
            setLoading(false);
        }
    }, [showAlert, showSuccess, fetchItems]);

    /**
     * Deletes a match setting
     * @param {number} id - Match setting ID to delete
     * @returns {Promise<boolean>} True if delete succeeded
     */
    const handleDelete = useCallback(async (id) => {
        try {
            setLoading(true);
            await deleteMatchSettingService(id);
            setItems(prev => prev.filter(s => s.id !== id));
            showSuccess?.(SUCCESS_MESSAGES.DELETED);
            return true;
        } catch (err) {
            console.error('Error deleting match setting:', err);
            showAlert?.('error', err.message || ERROR_MESSAGES.DELETE_FAILED);
            return false;
        } finally {
            setLoading(false);
        }
    }, [showAlert, showSuccess]);

    /**
     * Clones a match setting
     * @param {number} id - Match setting ID to clone
     * @returns {Promise<boolean>} True if clone succeeded
     */
    const handleClone = useCallback(async (id) => {
        try {
            setLoading(true);
            await cloneMatchSettingService(id);
            await fetchItems(); // Refresh to show new clone
            showSuccess?.(SUCCESS_MESSAGES.CLONED);
            return true;
        } catch (err) {
            console.error('Error cloning match setting:', err);
            showAlert?.('error', err.message || ERROR_MESSAGES.CLONE_FAILED);
            return false;
        } finally {
            setLoading(false);
        }
    }, [showAlert, showSuccess, fetchItems]);

    /**
     * Publishes a draft match setting
     * @param {number} id - Match setting ID to publish
     * @returns {Promise<boolean>} True if publish succeeded
     */
    const handlePublish = useCallback(async (id) => {
        try {
            setLoading(true);
            await publishMatchSettingService(id);
            await fetchItems(); // Refresh to show updated status
            showSuccess?.(SUCCESS_MESSAGES.PUBLISHED);
            return true;
        } catch (err) {
            console.error('Error publishing match setting:', err);
            showAlert?.('error', err.message || ERROR_MESSAGES.PUBLISH_FAILED);
            return false;
        } finally {
            setLoading(false);
        }
    }, [showAlert, showSuccess, fetchItems]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        items,
        loading,
        filter,
        setFilter,
        fetchItems,
        updateMatchSetting: handleUpdate,
        deleteMatchSetting: handleDelete,
        cloneMatchSetting: handleClone,
        publishMatchSetting: handlePublish,
        selectedMatchSetting,
        isPopupVisible,
        openPopup,
        closePopup
    };
};
