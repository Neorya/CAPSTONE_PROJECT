import React from 'react';
import { Alert } from 'antd';

/**
 * AlertNotification - Presentational component for displaying alerts
 * Simple wrapper around Ant Design Alert with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.type - Alert type (success, error, info, warning)
 * @param {string} props.message - Alert message to display
 * @param {Function} props.onClose - Callback when alert is closed
 * @returns {JSX.Element|null} Alert component or null if not visible
 */
const AlertNotification = ({ type, message, onClose }) => {
  return (
    <Alert
      id="match-alert"
      data-alert-type={type}
      message={message}
      type={type}
      closable
      onClose={onClose}
      showIcon
      style={{ marginBottom: 24 }}
    />
  );
};

export default AlertNotification;

