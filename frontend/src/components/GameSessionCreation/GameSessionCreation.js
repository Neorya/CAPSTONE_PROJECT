import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, Table, message, Checkbox, Tooltip, Input, DatePicker } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./GameSessionCreation.css";

import { getMatches } from "../../services/matchService.js";
import { createGameSession } from "../../services/gameSessionService.js";

const { Title, Text } = Typography;

// Validation constants
const MIN_SESSION_NAME_LENGTH = 5;
const MAX_SESSION_NAME_LENGTH = 100;

const GameSessionCreation = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [creating, setCreating] = useState(false);      // state for creation of game session
  const [sessionName, setSessionName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [firstPhase,setFirstPhase ] = useState(null);
  const [secondPhase,setSecondPhase ] = useState(null);
  
  // Validation error states
  const [sessionNameError, setSessionNameError] = useState("");
  const [startDateError, setStartDateError] = useState("");

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

  // Validate session name on change
  const validateSessionName = (value) => {
    if (!value.trim()) {
      return "Please enter a session name";
    }
    const trimmedLength = value.trim().length;
    if (trimmedLength < MIN_SESSION_NAME_LENGTH) {
      return `Session name must be at least ${MIN_SESSION_NAME_LENGTH} characters`;
    }
    if (trimmedLength > MAX_SESSION_NAME_LENGTH) {
      return `Session name must not exceed ${MAX_SESSION_NAME_LENGTH} characters`;
    }
    return "";
  };

  // Validate start date on change
  const validateStartDate = (date) => {
    if (!date) {
      return "Please select a start date and time";
    }
    const selectedDateTime = date.toDate();
    const now = new Date();
    if (selectedDateTime <= now) {
      return "Start date must be a future date and time";
    }
    return "";
  };

  // Handle session name change with validation
  const handleSessionNameChange = (e) => {
    setSessionName(e.target.value);
    setSessionNameError(validateSessionName(e.target.value));
  };

  const handleFirstPhaseChange = (e) => {
    setFirstPhase(e.target.value);
  };


  const handleSecondPhaseChange = (e) => {
    setSecondPhase(e.target.value);
  };

  // Handle start date change with validation
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartDateError(validateStartDate(date));
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const nameError = validateSessionName(sessionName);
    const dateError = validateStartDate(startDate);
    return !nameError && !dateError && selectedRows.length > 0;
  };

  const handleCreateSession = async () => {
    // Run all validations
    const nameError = validateSessionName(sessionName);
    const dateError = validateStartDate(startDate);

    setSessionNameError(nameError);
    setStartDateError(dateError);

    if (nameError) {
      message.warning(nameError);
      return;
    }
    if (dateError) {
      message.warning(dateError);
      return;
    }
    if (selectedRows.length === 0) {
      message.warning("Please select at least one match to create a game session");
      return;
    }

    try {
      setCreating(true);
      const creatorId = 1;         // TODO: replace with actual user ID when authentication is implemented
      await createGameSession(selectedRows, creatorId, sessionName.trim(), startDate.toDate().toISOString(), firstPhase, secondPhase);
      message.success("The game session has been created successfully!");
      // Reset form after successful creation
      setSessionName("");
      setStartDate(null);
      setSelectedRows([]);
      setSessionNameError("");
      setStartDateError("");
    } catch (error) {
      console.error("Failed to create game session:", error);
      message.error("Failed to create game session. Please try again.");
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

        {/* Session Details Section */}
        <div className="session-details-section">
          <Title level={5} className="section-title">Session Details</Title>
          
          <div className="session-form-fields">
            <div className="form-field">
              <label htmlFor="session-name" className="field-label">
                Session Name <span className="required">*</span>
              </label>
              <Input
                id="session-name"
                placeholder="Enter a descriptive name for this session"
                value={sessionName}
                onChange={handleSessionNameChange}
                size="large"
                status={sessionNameError ? "error" : ""}
                showCount
                maxLength={MAX_SESSION_NAME_LENGTH}
              />
              {sessionNameError && (
                <span className="field-error">{sessionNameError}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="start-date" className="field-label">
                Start Date & Time <span className="required">*</span>
              </label>
              <DatePicker
                id="start-date"
                showTime
                placeholder="Select date and time..."
                value={startDate}
                onChange={handleStartDateChange}
                size="large"
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
                status={startDateError ? "error" : ""}
              />
              {startDateError && (
                <span className="field-error">{startDateError}</span>
              )}
              
            </div>
            <div className="form-field">
              <label htmlFor="duration_firstphase" className="field-label">
                Duration First Phase in minutes <span className="required">*</span>
              </label>
              <Input
                id="duration_phas1"
                placeholder="Enter the first duration phase"
                value={firstPhase}
                onChange={handleFirstPhaseChange}
                size="large"
                type = "number"
                status={sessionNameError ? "error" : ""}  
              />
            </div>
            <div className="form-field">
              <label htmlFor="duration_secondphase" className="field-label">
                Duration Second Phase in minutes <span className="required">*</span>
              </label>
              <Input
                id="duration_phas2"
                placeholder="Enter the second duration phase"
                value={secondPhase}
                onChange={handleSecondPhaseChange}
                size="large"
                status={sessionNameError ? "error" : ""}
                type = "number"
              />
            </div>
          </div>
        </div>

        {/* Match Selection Section */}
        <div className="match-selection-section">
          <Title level={5} className="section-title">Select Matches</Title>
        </div>

        <div className="table-container">
          <Table
            id="game-session-creation-table"
            dataSource={items}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5, showSizeChanger: false }}
            rowKey="match_id"
            className="match-settings-table"
            locale={{ emptyText: "No matches found." }}
          />

          <div className="create-button-wrapper" id="create-game-session-button">
            <Button 
              type="primary" 
              onClick={handleCreateSession} 
              loading={creating}
              disabled={!isFormValid() || creating}
            >
              Create Game Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default GameSessionCreation;
