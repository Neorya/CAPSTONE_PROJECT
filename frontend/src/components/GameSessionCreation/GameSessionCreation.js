import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, Table, message, Checkbox, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./GameSessionCreation.css";

import { getMatches } from "../../services/matchService.js";
import { createGameSession } from "../../services/gameSessionService.js";

const { Title, Text } = Typography;

const GameSessionCreation = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [creating, setCreating] = useState(false);      // state for creation of game session

  // fetch matches 
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await getMatches();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleCheckboxChange = (matchId, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, matchId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== matchId));
    }
  };

  const handleCreateSession = async () => {
    if (selectedRows.length === 0) {
      message.warning("You should select at least a match to create a game session");
      return;
    }
    try {
      setCreating(true);
      const creatorId = 1;         // TODO: replace with actual user ID when authentication is implemented
      await createGameSession(selectedRows, creatorId);
      message.success("The game session has been created");
      navigate("/");
    } catch (error) {
      console.error("Failed to create game session:", error);
      message.error("Failed to create game session");
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Selected",
      key: "select",
      render: (_, record) => {
        const isSelected = selectedRows.includes(record.match_id);
        return (
          <Checkbox
            checked={isSelected}
            onChange={(e) => handleCheckboxChange(record.match_id, e.target.checked)}
          />
        );
      },
    },
  ];

  return (
    <div className="match-settings-list-container">
      <Card className="match-settings-card">
        <div className="page-header">
          <Tooltip title="Back to Home">
            <Button
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              shape="circle"
              size="large"
            />
          </Tooltip>
          <Title level={2} id="page_title" className="page-title">
            Create Game Session
          </Title>
          <span />
        </div>

        <div className="subheader">
          <Text type="secondary">
            Create a new Game Session selecting your desired matches
          </Text>
        </div>

        <Table
          id="game-session-creation-table"
          dataSource={items}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="match_id"
          className="match-settings-table"
          locale={{ emptyText: "No matches found." }}
        />

        <div className="confirm-button" id="create-game-session-button">
          <Button type="primary" onClick={handleCreateSession} loading={creating}>
            Create Game Session
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default GameSessionCreation;
