import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Tooltip, Typography, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import GameSessionCard from './components/GameSessionCard';
import { joinGameSession, getAvailableGame } from '../../services/joinGameSessionService';

const { Title, Text } = Typography;

const JoinGameSession = () => {
  const navigate = useNavigate();

  const [joining, setJoining] = useState(false);
  const [gameSession, setGameSession] = useState(null);
  const [fetchingSession, setFetchingSession] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const session = await getAvailableGame();

        if (session && session.game_id) {
          setGameSession(session);
        } else {
          setGameSession(null);
        }
      } catch (error) {
        console.error('Error fetching available game:', error);
        setGameSession(null);
      } finally {
        setFetchingSession(false);
      }
    };

    fetchGame();
  }, []);

  const handleJoin = async () => {
    if (!gameSession) return;

    setJoining(true);
    try {
      // TODO change this (1) to actual student id
      await joinGameSession(1, gameSession.game_id);
      message.success('Joined successfully!');
      navigate('/lobby');
    } catch (error) {
      console.error('Error joining session:', error);
      message.error('Failed to join the session. Please try again.');
    } finally {
      setJoining(false);
    }
  };


  const sessionDate = gameSession?.start_date ? new Date(gameSession.start_date) : null;
  const isExpired = sessionDate && !isNaN(sessionDate.getTime())
    ? sessionDate.getTime() < Date.now()
    : false;
  console.log(isExpired);

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Title level={2}>Join In-Person Game Session</Title>
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
            Compete with your classmates
          </Text>
        </div>

        <div>
          {fetchingSession ? (
            <div>
              <Spin tip="Looking for games..." />
            </div>
          ) : gameSession ? (
            <GameSessionCard
              name={gameSession.name}
              time={gameSession.start_date}
              onJoin={isExpired ? null : handleJoin}
              loading={joining}
            />
          ) : (
            <div>
              <Text type="secondary">
                No game session available
              </Text>
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};

export default JoinGameSession;
