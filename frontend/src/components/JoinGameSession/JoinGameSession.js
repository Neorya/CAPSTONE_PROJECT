import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Tooltip, Typography, message, Spin, Empty } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import GameSessionCard from "./components/GameSessionCard";
import {
  joinGameSession,
  getAvailableGame,
  hasStudentAlreadyJoinedSession,
} from "../../services/joinGameSessionService";

const { Title, Text } = Typography;

/**
 * Get the student ID from the JWT token stored in localStorage
 */
const getStudentIdFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      return parseInt(decoded.sub, 10);
    }
  } catch (e) {
    console.error('Error decoding token:', e);
  }
  return null;
};

/**
 * JoinGameSession component allows a student to join an available in-person game session.
 *
 * @returns {JSX.Element} The rendered component for joining a game session.
 */
const JoinGameSession = () => {
  const navigate = useNavigate();

  // Get the actual student ID from the token
  const studentId = getStudentIdFromToken();

  // state for fetching session and checking if student already joined
  const [initializing, setInitializing] = useState(true);

  // state for joining process
  const [joining, setJoining] = useState(false);

  // state for available game session
  const [gameSession, setGameSession] = useState(null);

  // check if student has already joined the game session
  const [studentAlreadyJoined, setStudentAlreadyJoined] = useState(false);

  // determine join state for button configuration
  const joinState = (() => {
    if (joining) return "joining";
    if (studentAlreadyJoined) return "alreadyJoined";
    return "ready";
  })();

  // Function to fetch available game session
  const fetchGameSession = useCallback(async () => {
    if (!studentId) return;
    
    try {
      const session = await getAvailableGame();

      if (session && session.game_id) {
        setGameSession(session);

        // check if student has already joined this session
        const joined = await hasStudentAlreadyJoinedSession(
          studentId,
          session.game_id
        );
        setStudentAlreadyJoined(joined);
      } else {
        setGameSession(null);
      }
    } catch (error) {
      console.error("Error fetching game session:", error);
      setGameSession(null);
      setStudentAlreadyJoined(false);
    }
  }, [studentId]);

  // Initial fetch + polling for available game sessions
  useEffect(() => {
    if (!studentId) {
      console.error("No student ID found in token");
      setInitializing(false);
      return;
    }

    const init = async () => {
      await fetchGameSession();
      setInitializing(false);
    };

    init();

    // Poll every 5 seconds to check for available game sessions
    const pollInterval = setInterval(fetchGameSession, 5000);

    return () => clearInterval(pollInterval);
  }, [studentId, fetchGameSession]);

  // handle join button click
  const handleJoin = async () => {
    console.log("joinState at click:", joinState);
    // if already joined, navigate to lobby/game page
    if (joinState === "alreadyJoined") {
      navigate("/lobby", { state: { gameId: gameSession.game_id } });
      return;
    }
    if (joinState !== "ready" || !gameSession || !studentId) return;
    setJoining(true);
    try {
      await joinGameSession(studentId, gameSession.game_id);
      message.success("Joined successfully!");
      navigate("/lobby", { state: { gameId: gameSession.game_id } });
    } catch (error) {
      message.warning(error.message || "Failed to join the session.");
      console.error("Error joining game session:", error);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Title level={2}>Join an in-person Game Session</Title>
          <Tooltip title="Back to Home">
            <Button
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/home")}
              shape="circle"
              size="large"
            />
          </Tooltip>
        </div>

        <div className="subheader">
          <Text type="secondary">Compete with your classmates!</Text>
        </div>

        <div>
          {initializing ? (
            <div>
              <Spin tip="Looking for games..." />
            </div>
          ) : gameSession ? (
            <GameSessionCard
              name={gameSession.name}
              time={gameSession.start_date}
              joinState={joinState}
              onJoin={handleJoin}
            />
          ) : (
            <div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary">
                    No sessions are currently open. Check back soon!
                  </Text>
                }
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JoinGameSession;
