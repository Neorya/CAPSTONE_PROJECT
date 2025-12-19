import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Tooltip, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAlert } from './hooks/useAlert';
import { useMatchSettings } from './hooks/useMatchSettings';
import { useMatchForm } from './hooks/useMatchForm';
import AlertNotification from './components/AlertNotification';
import MatchSettingsSelector from './components/MatchSettingsSelector';
import MatchFormFields from './components/MatchFormFields';
import './CreateMatchForm.css';

const { Title } = Typography;

/**
 * CreateMatchForm - Main component for creating new matches
 * Orchestrates child components and custom hooks to manage form state and submission
 * 
 * Architecture:
 * - Uses custom hooks for state management (useAlert, useMatchSettings, useMatchForm)
 * - Delegates UI rendering to presentational components
 * - Maintains single responsibility: orchestration only
 * 
 * @returns {JSX.Element} Create match form page
 */
const CreateMatchForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Custom hooks for state management
  const { alert, showAlert, hideAlert, resetAlert } = useAlert();
  const { matchSettings, isLoading } = useMatchSettings(showAlert);
  const {
    selectedMatchSetting,
    isSubmitting,
    isFormValid,
    handleFormChange,
    handleMatchSettingChange,
    handleSubmit,
    handleReset: resetForm
  } = useMatchForm(form, showAlert);

  /**
   * Handles form reset including alert state
   */
  const handleReset = () => {
    resetForm(resetAlert);
  };

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        {/* Page Header */}
        <div className="page-header">
          <Title level={2}>Create New Match</Title>
          <Tooltip title="Back to Home">
            <Button
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/home')}
              shape="circle"
              size="large"
            />
          </Tooltip>
        </div>

        {/* Alert Notification */}
        {alert.visible && (
          <AlertNotification
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
          />
        )}

        {/* Two-column layout: Match Settings + Form Fields */}
        <div className="form-layout">
          <MatchSettingsSelector
            matchSettings={matchSettings}
            isLoading={isLoading}
            selectedValue={selectedMatchSetting}
            onChange={handleMatchSettingChange}
          />

          <MatchFormFields
            form={form}
            onSubmit={handleSubmit}
            onFieldsChange={handleFormChange}
            onReset={handleReset}
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
          />
        </div>
      </Card>
    </div>
  );
};

export default CreateMatchForm;
