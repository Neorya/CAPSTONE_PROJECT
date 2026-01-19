import React, { useState } from 'react';
import { Card, Typography, Button, Alert, Divider, Space } from "antd";
import { GoogleOutlined, WarningOutlined, CodeOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../../services/config';
import { enableDevMode, isAuthEnabled } from '../../services/authService';
import "./Login.css";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const showDevButton = process.env.NODE_ENV === 'development';
  const authEnabled = isAuthEnabled();

  const handleLogin = () => {
    if (!authEnabled) {
      window.location.href = '/';
      return;
    }
    setIsLoading(true);
    window.location.href = `${API_BASE_URL}/auth/initiate`;
  };

  const handleSkipLogin = () => {
    setIsLoading(true);
    enableDevMode();
    window.location.href = '/';
  };

  const handleDevLogin = async (role) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/dev-login?role=${role}`, {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Dev login failed');
      }

      const data = await response.json();

      // Store the access token
      localStorage.setItem('token', data.access_token);

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Dev login error:', error);
      alert(`Failed to login as ${role}. Please check the console for details.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="tech-corner tech-tl" />
      <div className="tech-corner tech-tr" />
      <div className="tech-corner tech-bl" />
      <div className="tech-corner tech-br" />

      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <div className="login-logo-wrapper">
            <CodeOutlined className="logo-icon" />
          </div>
          <Title level={1} className="login-title">
            Codify
          </Title>
          <Paragraph className="login-subtitle">
            Master the Code. Dominate the Leaderboard.
          </Paragraph>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {!authEnabled ? (
            <div className="auth-disabled-section">
              <Alert
                message="Authentication Bypassed"
                description="The platform is running in open access mode for development."
                type="info"
                showIcon
                className="dev-alert"
              />
              <Button
                type="primary"
                size="large"
                block
                className="enter-platform-btn"
                style={{ marginTop: 20, height: '50px', borderRadius: '10px', fontWeight: '600' }}
                onClick={() => (window.location.href = '/')}
              >
                Enter Platform
              </Button>
            </div>
          ) : (
            <Button
              type="default"
              icon={<GoogleOutlined className="google-icon" />}
              size="large"
              onClick={handleLogin}
              block
              loading={isLoading}
              className="google-signin-button"
            >
              {isLoading ? 'Establishing Connection...' : 'Sign in with Google'}
            </Button>
          )}

          {showDevButton && (
            <div className="dev-mode-section">
              <Divider plain>Developer Access (DEV MODE ONLY)</Divider>
              <Alert
                message="Developer Sandbox"
                description="Quick login as test users for local testing. These buttons only appear in development mode."
                type="warning"
                icon={<WarningOutlined />}
                showIcon
                className="dev-alert"
              />
              <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 12 }}>
                <Button
                  type="dashed"
                  size="large"
                  onClick={() => handleDevLogin('student')}
                  block
                  loading={isLoading}
                  className="dev-login-btn dev-student-btn"
                >
                  🎓 Login as Student (Dev)
                </Button>
                <Button
                  type="dashed"
                  size="large"
                  onClick={() => handleDevLogin('teacher')}
                  block
                  loading={isLoading}
                  className="dev-login-btn dev-teacher-btn"
                >
                  👨‍🏫 Login as Teacher (Dev)
                </Button>
              </Space>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};
export default Login;