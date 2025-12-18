import React, { Component } from 'react';
import { Card, Typography, Button } from "antd";
import { GoogleOutlined } from '@ant-design/icons';
import "./Login.css";


const { Title } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class Login extends Component {

  handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/initiate`;
  };

  render() {
    return (
      <div className="login-container">
        <Card className="login-card">
          <Title level={2}>Login into the App</Title>
          <Button
            type="default"
            icon={<GoogleOutlined />}
            size="large"
            onClick={this.handleLogin}
            block
            style={{ marginTop: 20 }}
          >
            Sign in with Google
          </Button>
        </Card>
      </div>
    );
  }
}

export default Login;
