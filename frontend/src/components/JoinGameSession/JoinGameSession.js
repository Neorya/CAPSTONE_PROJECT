import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Tooltip, Typography, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import GameSessionCard from "./components/GameSessionCard";
import { joinGameSession, getAvailableGame, hasStudentAlreadyJoinedSession } from "../../services/joinGameSessionService";

const { Title, Text } = Typography;

const JoinGameSession = () => {
  const navigate = useNavigate();

  // state for fetching session and checking if student already joined
  const [initializing, setInitializing] = useState(true);

  // state for joining process
  const [joining, setJoining] = useState(false);

  // state for available game session
  const [gameSession, setGameSession] = useState(null);

  // check if student has already joined the game session
  const [studentAlreadyJoined, setStudentAlreadyJoined] = useState(false);

  // determine if the session is expired
  const sessionDate = gameSession?.start_date
    ? new Date(gameSession.start_date)
    : null;
  const isExpired =
    sessionDate && !isNaN(sessionDate.getTime())
      ? sessionDate.getTime() < Date.now()
      : false;

  // determine join state for button configuration
  const joinState = (() => {
    if (joining) return "joining";
    if (isExpired) return "expired";
    if (studentAlreadyJoined) return "alreadyJoined";
    return "ready";
  })();

  // get available game + check if student already joined
  useEffect(() => {
    const studentId = 1; // TODO: replace with real logged-in student id

    const init = async () => {
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
        console.error("Error initializing game session page:", error);
        setGameSession(null);
        setStudentAlreadyJoined(false);
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, []);

  // handle join button click
  const handleJoin = async () => {
    if (joinState !== "ready" || !gameSession) return;
    setJoining(true);
    try {
      // TODO change this (1) to actual student id
      await joinGameSession(1, gameSession.game_id);
      message.success("Joined successfully!");
      navigate("/lobby");
    } catch (error) {
      console.error("Error joining session:", error);
      message.error("Failed to join the session. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="create-match-container">
      <Card className="create-match-card">
        <div className="page-header">
          <Title level={2}>Join In-Person Game Session</Title>
          <Tooltip title="Back to Home">
            <Button
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
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
              <Text type="secondary">No game session available</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JoinGameSession;
