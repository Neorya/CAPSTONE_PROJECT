import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Typography, message, Tag } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  AppstoreOutlined,
  TrophyOutlined,
  CrownOutlined,
  FireOutlined,
  RocketOutlined
} from "@ant-design/icons";
import { getUserProfile } from "../../services/userService";
import "./HomePage.css";
import "../common/ActiveGame.css";
import useActiveGame from "../../hooks/useActiveGame";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const { activeGame, timeLeft } = useActiveGame();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setProfile(profile);
      } catch (err) {
        console.log("err: ", err);
      }
    };
    fetchProfile();
  }, []);

  // Role-specific greeting and subtitle
  const getGreeting = () => {
    const firstName = profile?.name?.split(' ')[0];
    const hour = new Date().getHours();
    let timeGreeting = 'Welcome';

    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    // Different fallback for teachers vs students
    const fallbackName = profile?.role === 'teacher' ? 'Instructor' : 'Champion';
    const displayName = firstName || fallbackName;

    return `${timeGreeting}, ${displayName}!`;
  };

  const getRoleSubtitle = () => {
    if (profile?.role === 'teacher') {
      return "Manage your arena. Create challenges. Inspire coders.";
    }
    return "Your next match awaits. Ready to compete?";
  };

  // Teacher-specific bento items with improved descriptions
  const teacherItems = [
    {
      id: "create-match",
      title: "Create New Match",
      description: "Design custom coding challenges with your own test cases and difficulty",
      icon: <PlusOutlined />,
      route: "/create-match",
      accent: "#3b82f6",
    },
    {
      id: "match-settings",
      title: "Match Settings",
      description: "Fine-tune scoring rules, time limits, and competition parameters",
      icon: <SettingOutlined />,
      route: "/match-settings",
      accent: "#10b981",
    },
    {
      id: "create-session",
      title: "Create Game Session",
      description: "Launch a new competition and invite students to join",
      icon: <PlayCircleOutlined />,
      route: "/create-game-session",
      accent: "#f59e0b",
    },
    {
      id: "view-sessions",
      title: "View Game Sessions",
      description: "Monitor active games, view results, and manage past sessions",
      icon: <UnorderedListOutlined />,
      route: "/game-sessions",
      accent: "#8b5cf6",
    },
  ];

  // Student-specific bento items with improved descriptions
  const studentItems = [
    {
      id: "join-session",
      title: "Join Game Sessions",
      description: "Browse available competitions and join the battle",
      icon: <TeamOutlined />,
      route: "/join-game-session",
      accent: "#ec4899",
    },
    {
      id: "lobby",
      title: "Lobby",
      description: "Prepare for your match and track countdown",
      icon: <AppstoreOutlined />,
      route: "/lobby",
      accent: "#06b6d4",
    },
  ];

  // Shared Hall of Fame item (featured)
  const hallOfFameItem = {
    id: "hall-of-fame",
    title: "Hall of Fame",
    description: "View top performers and climb the leaderboard rankings",
    icon: <TrophyOutlined />,
    route: "/hall-of-fame",
    accent: "#eab308",
    isFeatured: true,
  };

  // Combine items based on role
  const getFilteredItems = () => {
    if (profile?.role === 'teacher') {
      return [...teacherItems, hallOfFameItem];
    } else if (profile?.role === 'student') {
      return [...studentItems, hallOfFameItem];
    }
    // Fallback: show all
    return [...teacherItems, ...studentItems, hallOfFameItem];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="home-container">
      {/* Role indicator badge */}
      {profile?.role && (
        <div className="role-indicator">
          <Tag
            icon={profile.role === 'teacher' ? <CrownOutlined /> : <RocketOutlined />}
            color={profile.role === 'teacher' ? 'gold' : 'blue'}
            className="role-tag"
          >
            {profile.role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
          </Tag>
        </div>
      )}

      <div className="home-header">
        <Title level={1} className="home-title">
          {profile ? getGreeting() : 'Welcome to Codify'}
        </Title>
        <Paragraph className="home-subtitle">
          {profile ? getRoleSubtitle() : 'Select an option below to get started with creating and managing your matches.'}
        </Paragraph>
      </div>

      <div className="bento-grid">
        {filteredItems.map((item, index) => {
          const isActiveLobby = item.id === "lobby" && activeGame;
          const isFeatured = item.isFeatured;

          return (
            <div
              key={item.id}
              id={`bento-card-${item.id}`}
              className={`bento-card ${isActiveLobby ? 'active-session-card' : ''} ${isFeatured ? 'featured-card' : ''}`}
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => {
                if (isActiveLobby) {
                  const routes = {
                    lobby: `/lobby?gameId=${activeGame.game_id}`,
                    phase_one: `/phase-one?gameId=${activeGame.game_id}`,
                    phase_two: `/voting?gameId=${activeGame.game_id}`
                  };
                  const targetRoute = routes[activeGame.current_phase];

                  if (targetRoute) {
                    navigate(targetRoute);
                  } else {
                    message.error("Unable to continue session: Unknown game phase");
                    // Fallback to lobby
                    navigate(`/lobby?gameId=${activeGame.game_id}`);
                  }
                } else {
                  navigate(item.route);
                }
              }}
            >
              {/* Featured badge for Hall of Fame */}
              {isFeatured && !isActiveLobby && (
                <div className="featured-badge">
                  <FireOutlined /> TOP PERFORMERS
                </div>
              )}

              {/* Internal tag that follows card hover transforms */}
              {isActiveLobby && (
                <div id="active-session-tag" className="internal-status-tag">
                  IN PROGRESS
                </div>
              )}

              <div className="bento-card-inner">
                <div className="bento-header">
                  <div
                    className={`bento-icon ${isFeatured ? 'bento-icon-featured' : ''}`}
                    style={{
                      backgroundColor: isFeatured ? 'transparent' : `${item.accent}15`,
                      color: item.accent,
                      background: isFeatured ? `linear-gradient(135deg, ${item.accent}20, ${item.accent}40)` : undefined,
                      border: `2px solid ${item.accent}30`,
                    }}
                  >
                    {isActiveLobby ? <PlayCircleOutlined /> : item.icon}
                  </div>
                  <h3 className="bento-title">
                    {isActiveLobby ? "Active Session" : item.title}
                  </h3>
                </div>
                <div className="bento-text">
                  <p id={isActiveLobby ? "active-session-description" : undefined} className="bento-description">
                    {isActiveLobby
                      ? `Continue: ${activeGame.game_name || 'Current Game'}`
                      : item.description}
                  </p>
                  {isActiveLobby && timeLeft > 0 && (
                    <div id="active-session-timer" className="card-timer">
                      {Math.floor(timeLeft / 60)}m {(timeLeft % 60).toString().padStart(2, "0")}s left
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`bento-accent-bar ${isFeatured ? 'bento-accent-bar-featured' : ''}`}
                style={{ backgroundColor: isActiveLobby ? "#10b981" : item.accent }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
