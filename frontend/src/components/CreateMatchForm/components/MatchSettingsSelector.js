import React from 'react';
import { Radio, Space, Spin, Typography } from 'antd';
import { INFO_MESSAGES } from '../constants';

const { Title } = Typography;

/**
 * MatchSettingsSelector - Component for displaying and selecting match settings
 * Shows a scrollable list of radio buttons for available match settings
 * 
 * @param {Object} props
 * @param {Array} props.matchSettings - List of available match settings
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {number|null} props.selectedValue - Currently selected match setting ID
 * @param {Function} props.onChange - Callback when selection changes
 * @returns {JSX.Element} Match settings selector component
 */
const MatchSettingsSelector = ({
  matchSettings,
  isLoading,
  selectedValue,
  onChange
}) => {
  return (
    <div className="match-settings-column">
      <div className="match-settings-header">
        <Title level={4}>Match Settings</Title>
        <p className="match-settings-subtitle">
          Select one match setting from the ready list
        </p>
      </div>

      <div className="match-settings-scrollable">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" tip="Loading match settings..." />
          </div>
        ) : (
          <Radio.Group
            id="match-settings-radio-group"
            onChange={onChange}
            value={selectedValue}
            className="match-settings-radio-group"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {matchSettings.length > 0 ? (
                matchSettings.map((setting) => (
                  <Radio
                    key={setting.match_set_id}
                    value={setting.match_set_id}
                    className="match-setting-radio"
                    id={`match-setting-${setting.match_set_id}`}
                    data-testid={`match-setting-${setting.match_set_id}`}
                  >
                    <span className="match-setting-name">{setting.title}</span>
                  </Radio>
                ))
              ) : (
                <div className="no-settings-message" id="no-settings-message">
                  {INFO_MESSAGES.NO_READY_SETTINGS}
                </div>
              )}
            </Space>
          </Radio.Group>
        )}
      </div>
    </div>
  );
};

export default MatchSettingsSelector;

