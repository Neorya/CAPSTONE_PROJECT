import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Radio, Select, InputNumber, Button, Alert, Card, Space, Typography, Input, Spin, Tooltip } from 'antd';
import { SaveOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { createMatch } from '../../services/matchService';
import { fetchMatchSettings } from '../../services/matchSettingsService';
import './CreateMatchForm.css';
import { log } from 'async';

const { Title } = Typography;
const { Option } = Select;

const CreateMatchForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedMatchSetting, setSelectedMatchSetting] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchSettings, setMatchSettings] = useState([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateForm = useCallback((matchSettingValue) => {
    const requiredFields = ['title', 'difficulty_level', 'review_number', 'duration_phase1', 'duration_phase2'];
    
    // Use getFieldsError to check validation
    const fieldErrors = form.getFieldsError(requiredFields);
    const hasErrors = fieldErrors.some(field => field.errors.length > 0);
    
    // Check if all required fields have values
    const fieldValues = form.getFieldsValue(requiredFields);
    const allFieldsFilled = requiredFields.every(field => {
      const value = fieldValues[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    setIsFormValid(!hasErrors && allFieldsFilled && matchSettingValue !== null);
  }, [form]);

  const handleFormChange = useCallback(() => {
    validateForm(selectedMatchSetting);
  }, [validateForm, selectedMatchSetting]);

  useEffect(() => {
    const loadMatchSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const settings = await fetchMatchSettings('Ready');
        console.log(settings);
        setMatchSettings(settings);
        
        if (settings.length === 0) {
          showAlert('info', 'No ready match settings available. Please create and mark a match setting as ready first.');
        }
      } catch (error) {
        console.error('Error loading match settings:', error);
        
        const errorMessage = error.message.includes('fetch')
          ? 'Cannot connect to the server. Please make sure the backend is running (docker-compose up).'
          : `Failed to load match settings: ${error.message}`;
        
        showAlert('error', errorMessage);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadMatchSettings();
  }, []);

  const handleMatchSettingChange = (e) => {
    const newValue = e.target.value;
    setSelectedMatchSetting(newValue);
    validateForm(newValue);
  };

  const handleSubmit = async (values) => {
    if (!selectedMatchSetting) {
      showAlert('error', 'You should select a match setting to create a match');
      return;
    }

    setIsSubmitting(true);

    try {
      const matchData = {
        title: values.title,
        match_set_id: selectedMatchSetting,
        creator_id: values.creator_id || 1,
        difficulty_level: values.difficulty_level,
        review_number: values.review_number,
        duration_phase1: values.duration_phase1,
        duration_phase2: values.duration_phase2,
      };

      const createdMatch = await createMatch(matchData);
      showAlert('success', `Match "${createdMatch.title}" has been created successfully!`);
      
      form.resetFields();
      setSelectedMatchSetting(null);
      setIsFormValid(false);
      
    } catch (error) {
      showAlert('error', error.message || 'Failed to create match. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedMatchSetting(null);
    setAlertVisible(false);
    setIsFormValid(false);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Title level={2}>Create New Match</Title>
          <Tooltip title="Back to Home">
            <Button 
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/')}
              shape="circle"
              size="large"
            />
          </Tooltip>
        </div>
        
        {alertVisible && (
          <Alert
            id="match-alert"
            data-alert-type={alertType}
            message={alertMessage}
            type={alertType}
            closable
            onClose={handleAlertClose}
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <div className="form-layout">
          <div className="match-settings-column">
            <div className="match-settings-header">
              <Title level={4}>Match Settings</Title>
              <p className="match-settings-subtitle">Select one match setting from the ready list</p>
            </div>
            <div className="match-settings-scrollable">
              {isLoadingSettings ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" tip="Loading match settings..." />
                </div>
              ) : (
                <Radio.Group
                  id="match-settings-radio-group"
                  onChange={handleMatchSettingChange}
                  value={selectedMatchSetting}
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
                        No ready match settings available. Please create a match setting first.
                      </div>
                    )}
                  </Space>
                </Radio.Group>
              )}
            </div>
          </div>

          <div className="form-fields-column">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onFieldsChange={handleFormChange}
              initialValues={{
                review_number: 4,
                creator_id: 1,
              }}
            >
              <Form.Item
                label="Match Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a match title',
                  },
                  {
                    min: 10,
                    message: 'Title must be at least 10 characters',
                  },
                  {
                    max: 150,
                    message: 'Title must not exceed 150 characters',
                  },
                ]}
              >
                <Input
                  id="title-input"
                  placeholder="Enter a descriptive title for this match"
                  size="large"
                  showCount
                  maxLength={150}
                />
              </Form.Item>

              <Form.Item name="creator_id" hidden>
                <InputNumber />
              </Form.Item>

              <Form.Item
                label="Difficulty Level"
                name="difficulty_level"
                rules={[
                  {
                    required: true,
                    message: 'Please select a difficulty level',
                  },
                ]}
              >
                <Select 
                  id="difficulty-select"
                  placeholder="Select difficulty level" 
                  size="large"
                >
                  <Option value={1}>Easy</Option>
                  <Option value={2}>Medium</Option>
                  <Option value={3}>Hard</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Review Number"
                name="review_number"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the number of reviewers',
                  },
                  {
                    type: 'number',
                    min: 1,
                    max: 10,
                    message: 'Reviewers must be between 1 and 10',
                  },
                ]}
              >
                <InputNumber
                  id="reviewers-input"
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Enter number of reviewers (default: 4)"
                />
              </Form.Item>

              <Form.Item
                label="Duration Phase 1 (minutes)"
                name="duration_phase1"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the first phase duration',
                  },
                  {
                    type: 'number',
                    min: 1,
                    message: 'Duration must be at least 1 minute',
                  },
                ]}
              >
                <InputNumber
                  id="first-phase-duration-input"
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Enter duration in minutes"
                />
              </Form.Item>

              <Form.Item
                label="Duration Phase 2 (minutes)"
                name="duration_phase2"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the second phase duration',
                  },
                  {
                    type: 'number',
                    min: 1,
                    message: 'Duration must be at least 1 minute',
                  },
                ]}
              >
                <InputNumber
                  id="second-phase-duration-input"
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Enter duration in minutes"
                />
              </Form.Item>

              <Form.Item>
                <Space size="middle">
                  <Button
                    id="save-match-button"
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isSubmitting}
                    size="large"
                    disabled={!isFormValid || isSubmitting}
                  >
                    Save Match
                  </Button>
                  <Tooltip title="Clear all form fields and start over">
                    <Button
                      id="reset-button"
                      danger
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                      size="large"
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                  </Tooltip>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateMatchForm;

