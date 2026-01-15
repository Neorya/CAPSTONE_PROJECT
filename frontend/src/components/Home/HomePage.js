import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  AppstoreOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import "./HomePage.css";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const bentoItems = [
    {
      id: "create-match",
      title: "Create New Match",
      description: "Set up a new match with settings, difficulty, and duration",
      icon: <PlusOutlined />,
      route: "/create-match",
      accent: "#3b82f6"
    },
    {
      id: "match-settings",
      title: "Match Settings",
      description: "Browse and manage all available match settings",
      icon: <SettingOutlined />,
      route: "/match-settings",
      accent: "#10b981"
    },
    {
      id: "create-session",
      title: "Create Game Session",
      description: "Create a new game session for students to join",
      icon: <PlayCircleOutlined />,
      route: "/create-game-session",
      accent: "#f59e0b"
    },
    {
      id: "view-sessions",
      title: "View Game Sessions",
      description: "Browse, clone, delete, view, or modify your created game sessions",
      icon: <UnorderedListOutlined />,
      route: "/game-sessions",
      accent: "#8b5cf6"
    },
    {
      id: "join-session",
      title: "Join Game Sessions",
      description: "Join or list future and past game sessions",
      icon: <TeamOutlined />,
      route: "/join-game-session",
      accent: "#ec4899"
    },
    {
      id: "lobby",
      title: "Lobby",
      description: "View and manage your current game lobby",
      icon: <AppstoreOutlined />,
      route: "/lobby",
      accent: "#06b6d4"
    },
    {
      id: "hall-of-fame",
      title: "Hall of Fame",
      description: "View the leaderboard and top performers",
      icon: <TrophyOutlined />,
      route: "/hall-of-fame",
      accent: "#eab308"
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <Title level={1} className="home-title">
          Welcome to Codify
        </Title>
        <Paragraph className="home-subtitle">
          Select an option below to get started with creating and managing your matches.
        </Paragraph>
      </div>

      <div className="bento-grid">
        {bentoItems.map((item) => (
          <div
            key={item.id}
            className="bento-card"
            onClick={() => navigate(item.route)}
          >
            <div className="bento-card-inner">
              <div
                className="bento-icon"
                style={{
                  backgroundColor: `${item.accent}15`,
                  color: item.accent
                }}
              >
                {item.icon}
              </div>
              <div className="bento-text">
                <h3 className="bento-title">{item.title}</h3>
                <p className="bento-description">{item.description}</p>
              </div>
              <div
                className="bento-arrow"
                style={{ color: item.accent }}
              >
                →
              </div>
            </div>
            <div
              className="bento-accent-bar"
              style={{ backgroundColor: item.accent }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
