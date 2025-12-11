import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Space } from "antd";
import { PlusOutlined, SettingOutlined, PlayCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import "./HomePage.css";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Card className="home-card">
        <Title level={2}>Welcome to Match Management System</Title>
        <Paragraph>
          Select an option below to get started with creating and managing your
          matches.
        </Paragraph>

        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", marginTop: 32 }}
        >
          <Card
            hoverable
            bordered={false}
            className="action-card"
            onClick={() => navigate("/create-match")}
          >
            <Space>
              <PlusOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Create New Match
                </Title>
                <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                  Set up a new match with settings, difficulty, and duration
                </Paragraph>
              </div>
            </Space>
          </Card>

          <Card
            hoverable
            bordered={false}
            className="action-card"
            onClick={() => navigate("/match-settings")}
          >
            <Space>
              <SettingOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Match Settings
                </Title>
                <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                  Browse and manage all available match settings
                </Paragraph>
              </div>
            </Space>
          </Card>

          <Card
            hoverable
            bordered={false}
            className="action-card"
            onClick={() => navigate("/create-game-session")}
          >
            <Space>
              <PlayCircleOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Create Game Session
                </Title>
                <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                  Create a new game session for students to join
                </Paragraph>
              </div>
            </Space>
          </Card>


          <Card
            hoverable
            bordered={false}
            className="action-card"
            onClick={() => navigate("/pre-start-game-session")}
          >
            <Space>
              <PlayCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Start Game Session
                </Title>
                <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                  Start new game session so the students can join in it
            onClick={() => navigate("/game-sessions")}
          >
            <Space>
              <UnorderedListOutlined style={{ fontSize: 24, color: "#722ed1" }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  View Game Sessions
                </Title>
                <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                  Browse, clone, delete, view, or modify your created game sessions
                </Paragraph>
              </div>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default HomePage;
