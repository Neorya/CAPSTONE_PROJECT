import React, { useState } from 'react';
import { Card, Typography, Button, Alert, Divider, Space } from "antd";
import { GoogleOutlined, WarningOutlined, FireOutlined } from '@ant-design/icons';
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
      <Card className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <FireOutlined className="logo-icon" />
          </div>
          <Title level={2} className="login-title">
            Codify
          </Title>
          <Paragraph className="login-subtitle">
            Gamified coding platform
          </Paragraph>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {!authEnabled ? (
            <>
              <Alert
                message="Authentication is currently disabled"
                description="Route protection and Google sign-in are bypassed (controlled by REACT_APP_AUTH_ENABLED or the Navbar toggle)."
                type="info"
                showIcon
              />
              <Button
                type="primary"
                size="large"
                block
                onClick={() => (window.location.href = '/')}
              >
                Continue
              </Button>
            </>
          ) : (
            <Button
              type="default"
              icon={<GoogleOutlined />}
              size="large"
              onClick={handleLogin}
              block
              loading={isLoading}
              className="google-signin-button"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          )}

          {showDevButton && (
            <div className="dev-mode-section">
              <Divider>Development Mode</Divider>
              <Alert
                message="Development Mode Active"
                description="Skip login is only available during development"
                type="warning"
                icon={<WarningOutlined />}
                showIcon
                style={{ marginBottom: 12 }}
              />
              <Button
                type="ghost"
                size="large"
                onClick={handleSkipLogin}
                block
                loading={isLoading}
                danger
              >
                Skip Login (Dev Only)
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default Login;