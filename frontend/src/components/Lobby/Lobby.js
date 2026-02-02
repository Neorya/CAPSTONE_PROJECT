import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Card, Tooltip, Typography, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { checkGameSessionStatus } from '../../services/gameSessionService';

const { Title, Text } = Typography;

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(false);
  const hasShownMessage = useRef(false);

  // Get gameId from location state OR URL query params (fallback for when state is lost)
  const gameId = location.state?.gameId || searchParams.get('gameId');

  useEffect(() => {
    if (!gameId) {
      console.log('Lobby: No gameId found');
      // Only show the message once, even if effect runs multiple times
      if (!hasShownMessage.current) {
        message.info('No game session found. Please join a game session first.');
        hasShownMessage.current = true;
      }
      navigate('/join-game-session');
      return;
    }

    console.log('Lobby: Starting polling for gameId:', gameId);

    // Poll every 2 seconds to check if the game has started
    const pollInterval = setInterval(async () => {
      try {
        setChecking(true);
        const status = await checkGameSessionStatus(gameId);
        console.log('Lobby: Game status:', status);

        if (status.has_started) {
          // Game has started, redirect to phase one
          clearInterval(pollInterval);
          console.log('Lobby: Game started! Redirecting to phase-one with gameId:', gameId);
          message.success('Game session has started!');
          navigate(`/phase-one?gameId=${gameId}`);
        }
      } catch (error) {
        console.error('Error checking game session status:', error);
        // Continue polling even if there's an error
      } finally {
        setChecking(false);
      }
    }, 2000); // Poll every 2 seconds

    // Cleanup interval on unmount
    return () => {
      console.log('Lobby: Cleanup - stopping polling');
      clearInterval(pollInterval);
    };
  }, [gameId, navigate]);

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Title level={2}>Lobby</Title>
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

        <div className="page-subtitle">
          <Text type="secondary">
            Waiting for the game to start...
          </Text>
          {checking && <Spin style={{ marginLeft: '10px' }} />}
        </div>
      </Card>
    </div>
  );
};

export default Lobby;
