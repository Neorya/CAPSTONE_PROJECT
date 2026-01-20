import React, { useState, useEffect } from "react";
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
import { getUserProfile } from "../../services/userService";
import "./HomePage.css";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const profile = await getUserProfile();
        setUserRole(profile.role);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  const bentoItems = [
    {
      id: "create-match",
      title: "Create New Match",
      description: "Set up a new match with settings, difficulty, and duration",
      icon: <PlusOutlined />,
      route: "/create-match",
      accent: "#3b82f6",
      roles: ["teacher"]
    },
    {
      id: "match-settings",
      title: "Match Settings",
      description: "Browse and manage all available match settings",
      icon: <SettingOutlined />,
      route: "/match-settings",
      accent: "#10b981",
      roles: ["teacher"]
    },
    {
      id: "create-session",
      title: "Create Game Session",
      description: "Create a new game session for students to join",
      icon: <PlayCircleOutlined />,
      route: "/create-game-session",
      accent: "#f59e0b",
      roles: ["teacher"]
    },
    {
      id: "view-sessions",
      title: "View Game Sessions",
      description: "Browse, clone, delete, view, or modify your created game sessions",
      icon: <UnorderedListOutlined />,
      route: "/game-sessions",
      accent: "#8b5cf6",
      roles: ["teacher"]
    },
    {
      id: "join-session",
      title: "Join Game Sessions",
      description: "Join or list future and past game sessions",
      icon: <TeamOutlined />,
      route: "/join-game-session",
      accent: "#ec4899",
      roles: ["student"]
    },
    {
      id: "lobby",
      title: "Lobby",
      description: "View and manage your current game lobby",
      icon: <AppstoreOutlined />,
      route: "/lobby",
      accent: "#06b6d4",
      roles: ["student"]
    },
    {
      id: "hall-of-fame",
      title: "Hall of Fame",
      description: "View the leaderboard and top performers",
      icon: <TrophyOutlined />,
      route: "/hall-of-fame",
      accent: "#eab308",
      roles: ["teacher", "student"]
    }
  ];

  // Filter items based on user role
  const filteredItems = userRole
    ? bentoItems.filter(item => item.roles.includes(userRole))
    : [];

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-header">
          <Title level={1} className="home-title">
            Welcome to Codify
          </Title>
          <Paragraph className="home-subtitle">
            Loading...
          </Paragraph>
        </div>
      </div>
    );
  }

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
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bento-card"
            onClick={() => navigate(item.route)}
          >
            <div className="bento-card-inner">
              <div className="bento-header">
                <div
                  className="bento-icon"
                  style={{
                    backgroundColor: `${item.accent}15`,
                    color: item.accent
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="bento-title">{item.title}</h3>
              </div>
              <div className="bento-text">
                <p className="bento-description">{item.description}</p>
              </div>
            </div>
            <div
              className="bento-accent-bar"
              style={{ backgroundColor: item.accent }}
            />
          </div>
        ))}
      </div>
    </div >
  );
};

export default HomePage;
