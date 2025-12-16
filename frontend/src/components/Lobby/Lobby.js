import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Tooltip, Typography, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Title level={2}>Lobby</Title>
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

        <div className="page-subtitle">
          <Text type="secondary">
            Waiting for the game to start...
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Lobby;
