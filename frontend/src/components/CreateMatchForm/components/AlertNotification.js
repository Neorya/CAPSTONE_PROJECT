import React from 'react';
import PopupAlert from '../../common/PopupAlert';

/**
 * AlertNotification - Presentational component for displaying alerts
 * Simple wrapper around PopupAlert with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.type - Alert type (success, error, info, warning)
 * @param {string} props.message - Alert message to display
 * @param {Function} props.onClose - Callback when alert is closed
 * @returns {JSX.Element|null} Alert component or null if not visible
 */
const AlertNotification = ({ type, message, onClose }) => {
  return (
    <PopupAlert
      id="match-alert"
      message={message}
      type={type}
      onClose={onClose}
      style={{ marginBottom: 24 }}
    />
  );
};

export default AlertNotification;

