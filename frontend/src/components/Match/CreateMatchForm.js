import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Radio, Select, InputNumber, Button, Alert, Card, Space, Typography } from 'antd';
import { SaveOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { mockMatchSettings } from '../../data/mockData';
import './CreateMatchForm.css';

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

  // Filter only Ready match settings
  const readyMatchSettings = mockMatchSettings.filter(
    setting => setting.status === 'Ready'
  );

  const handleMatchSettingChange = (e) => {
    setSelectedMatchSetting(e.target.value);
  };

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async (values) => {
    // Check if match setting is selected
    if (!selectedMatchSetting) {
      showAlert('error', 'You should select a match setting to create a match');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock POST API call
      const matchData = {
        matchSettingId: selectedMatchSetting,
        difficultyLevel: values.difficulty,
        reviewNumber: values.reviewers,
        durationFirstPhase: values.firstPhaseDuration,
        durationSecondPhase: values.secondPhaseDuration,
      };

      // Simulate API call
      await mockCreateMatch(matchData);

      // On success
      showAlert('success', 'The match has been created');
      
      // Reset form after success
      form.resetFields();
      setSelectedMatchSetting(null);

      // Navigate back to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      showAlert('error', 'Failed to create match. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedMatchSetting(null);
    setAlertVisible(false);
    navigate('/');
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            style={{ marginBottom: 16 }}
          >
            Back to Home
          </Button>
          <Title level={2}>Create New Match</Title>
        </div>
        
        {alertVisible && (
          <Alert
            message={alertMessage}
            type={alertType}
            closable
            onClose={handleAlertClose}
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <div className="form-layout">
          {/* Left Column - Match Settings List */}
          <div className="match-settings-column">
            <div className="match-settings-header">
              <Title level={4}>Match Settings</Title>
              <p className="match-settings-subtitle">Select one match setting from the ready list</p>
            </div>
            <div className="match-settings-scrollable">
              <Radio.Group
                onChange={handleMatchSettingChange}
                value={selectedMatchSetting}
                className="match-settings-radio-group"
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {readyMatchSettings.length > 0 ? (
                    readyMatchSettings.map((setting) => (
                      <Radio key={setting.id} value={setting.id} className="match-setting-radio">
                        <span className="match-setting-name">{setting.name}</span>
                      </Radio>
                    ))
                  ) : (
                    <div className="no-settings-message">
                      No ready match settings available. Please create a match setting first.
                    </div>
                  )}
                </Space>
              </Radio.Group>
            </div>
          </div>

          {/* Right Column - Other Form Fields */}
          <div className="form-fields-column">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              /*initialValues={{ // Default values removed for semplicity
                reviewers: 4,
              }}*/
            >
              {/* Difficulty Level */}
              <Form.Item
                label="Difficulty Level"
                name="difficulty"
                rules={[
                  {
                    required: true,
                    message: 'Please select a difficulty level',
                  },
                ]}
              >
                <Select placeholder="Select difficulty level" size="large">
                  <Option value="Easy">Easy</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Hard">Hard</Option>
                </Select>
              </Form.Item>

              {/* Review Number */}
              <Form.Item
                label="Review Number"
                name="reviewers"
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
                  min={1}
                  max={10}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Enter number of reviewers (default: 4)"
                />
              </Form.Item>

              {/* Duration First Phase */}
              <Form.Item
                label="Duration First Phase (minutes)"
                name="firstPhaseDuration"
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
                  min={1}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Enter duration in minutes"
                />
              </Form.Item>

              {/* Duration Second Phase */}
              <Form.Item
                label="Duration Second Phase (minutes)"
                name="secondPhaseDuration"
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
                  min={1}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Enter duration in minutes"
                />
              </Form.Item>

              {/* Form Actions */}
              <Form.Item>
                <Space size="middle">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isSubmitting}
                    size="large"
                    disabled={!selectedMatchSetting}
                  >
                    Save Match
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    size="large"
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Mock API function to simulate POST request
const mockCreateMatch = (matchData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Creating match with data:', matchData);
      // Simulate successful creation
      resolve({
        status: 201,
        data: {
          id: Math.floor(Math.random() * 1000),
          ...matchData,
          createdAt: new Date().toISOString(),
        },
      });
    }, 500);
  });
};

export default CreateMatchForm;

