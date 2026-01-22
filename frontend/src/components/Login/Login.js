import React, { useState } from 'react';
import { GoogleOutlined, WarningOutlined, CodeOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../../services/config';
import { isAuthEnabled } from '../../services/authService';
import { WebGLShader } from '../ui/WebGLShader';
import { LiquidButton } from '../ui/LiquidGlassButton';
import "./Login.css";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [devSectionOpen, setDevSectionOpen] = useState(false);
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

  const handleDevLogin = async (role) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/dev-login?role=${role}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Dev login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      window.location.href = '/';
    } catch (error) {
      console.error('Dev login error:', error);
      alert(`Failed to login as ${role}. Please check the console for details.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* WebGL Shader Background */}
      <WebGLShader />

      {/* Main Content */}
      <div className="login-content">
        {/* Outer Border */}
        <div className="login-outer-frame">
          {/* Inner Border / Main Card */}
          <main className="login-inner-frame">
            {/* Logo Icon */}
            <div className="login-logo">
              <CodeOutlined />
            </div>

            {/* Title */}
            <h1 className="login-title">Codify</h1>

            {/* Subtitle */}
            <p className="login-subtitle">
              Master the Code. Dominate the Leaderboard.
            </p>

            {/* Status Indicator */}
            <div className="login-status">
              <span className="status-ping"></span>
              <span className="status-dot"></span>
              <span className="status-text">Ready for Battle</span>
            </div>

            {/* Login Button - Liquid Glass */}
            <div className="login-actions">
              {!authEnabled ? (
                <>
                  <div className="auth-bypass-badge">Open Access Mode</div>
                  <LiquidButton
                    className="liquid-btn liquid-btn-enter"
                    size="xl"
                    onClick={() => (window.location.href = '/')}
                  >
                    Enter the Arena
                  </LiquidButton>
                </>
              ) : (
                <LiquidButton
                  className="liquid-btn liquid-btn-google"
                  size="xl"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  <GoogleOutlined className="btn-icon" />
                  <span>{isLoading ? 'Connecting...' : ' Login with Google'}</span>
                </LiquidButton>
              )}
            </div>

            {/* Developer Access Section */}
            {showDevButton && (
              <div className="dev-section">
                <button
                  className="dev-toggle"
                  onClick={() => setDevSectionOpen(!devSectionOpen)}
                >
                  <WarningOutlined className="dev-warn-icon" />
                  <span>Developer Access</span>
                  <span className={`dev-chevron ${devSectionOpen ? 'open' : ''}`}>▼</span>
                </button>

                {devSectionOpen && (
                  <div className="dev-panel">
                    <p className="dev-hint">Quick login for local development only.</p>
                    <div className="dev-buttons">
                      <button
                        className="dev-btn dev-btn-student"
                        onClick={() => handleDevLogin('student')}
                        disabled={isLoading}
                      >
                        <UserOutlined />
                        <span>🎓 Student</span>
                      </button>
                      <button
                        className="dev-btn dev-btn-teacher"
                        onClick={() => handleDevLogin('teacher')}
                        disabled={isLoading}
                      >
                        <BookOutlined />
                        <span>👨‍🏫 Teacher</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Login;