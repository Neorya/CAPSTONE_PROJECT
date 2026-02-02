import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Card, Tooltip, Typography, message, Spin, Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { checkGameSessionStatus, getGameSessionDetails } from '../../services/gameSessionService';

const { Title, Text } = Typography;

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasShownMessage = useRef(false);

  // Get gameId from location state OR URL query params (fallback for when state is lost)
  const gameId = location.state?.gameId || searchParams.get('gameId');

  // Fetch game session details on mount
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

    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const details = await getGameSessionDetails(gameId);
        setGameDetails(details);
        console.log('Lobby: Fetched game details:', details);
      } catch (error) {
        console.error('Error fetching game details:', error);
        message.error('Failed to load game session details');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId, navigate]);

  // Poll for game start status
  useEffect(() => {
    if (!gameId) return;

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">Loading game session details...</Text>
            </div>
          </div>
        ) : gameDetails ? (
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TeamOutlined />
                <span>{gameDetails.name}</span>
              </div>
            }
            style={{ marginTop: '24px' }}
            bordered={false}
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label={<><ClockCircleOutlined /> Scheduled Start</>}>
                <Text strong>{formatDate(gameDetails.start_date)}</Text>
              </Descriptions.Item>


              <Descriptions.Item label="Phase 1 Duration">
                <Text>{gameDetails.duration_phase1 || 'Not set'} minutes</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Phase 2 Duration">
                <Text>{gameDetails.duration_phase2 || 'Not set'} minutes</Text>
              </Descriptions.Item>

              <Descriptions.Item label={<><TeamOutlined /> Participants</>}>
                <Text strong>{gameDetails.students?.length || 0} player(s)</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color="orange">Waiting to Start</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">Unable to load game session details</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Lobby;
