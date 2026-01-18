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
              <Divider plain>Developer Access</Divider>
              <Alert
                message="Developer Sandbox"
                description="Bypass authentication for local testing and debugging."
                type="warning"
                icon={<WarningOutlined />}
                showIcon
                className="dev-alert"
              />
              <Button
                type="text"
                size="large"
                onClick={handleSkipLogin}
                block
                loading={isLoading}
                className="skip-login-btn"
              >
                Skip Authentication
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};
export default Login;