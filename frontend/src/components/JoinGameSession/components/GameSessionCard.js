import React from "react";
import { Button, Card, Typography, Space, Tag } from "antd";
import { CalendarOutlined, PlayCircleOutlined } from "@ant-design/icons";
import "./GameSessionCard.css";

const { Text } = Typography;

// configuration for different button states
const configByState = {
  ready: {
    disabled: false,
    loading: false,
    label: "Join Game",
    statusText: "Open",
    statusColor: "green",
  },
  joining: {
    disabled: true,
    loading: true,
    label: "Joining...",
    statusText: "Joining...",
    statusColor: "blue",
  },
  alreadyJoined: {
    disabled: false,
    loading: false,
    label: "Enter",
    statusText: "Joined",
    statusColor: "geekblue",
  }
};

/**
 * Displays a card with information about a game session and allows the user to join or enter the session.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the game session.
 * @param {string} props.time - The scheduled time of the game session (ISO string).
 * @param {"ready"|"joining"|"alreadyJoined"} props.joinState - The current join state for the session.
 * @param {function} [props.onJoin] - Callback invoked when the user attempts to join or enter the session.
 * @returns {JSX.Element} The rendered game session card component.
 */
const GameSessionCard = ({ name, time, joinState, onJoin }) => {
  const { disabled, loading, label, statusText, statusColor } =
    configByState[joinState] || configByState.ready;

  const handleClick = () => {
    if (disabled) return;
    if (joinState === "ready" || joinState === "alreadyJoined") {
      onJoin?.();
    }
  };

  const date = new Date(time);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="game-session-card">
      <div className="card-header-row">
        <div className="card-header-left">
          <Text type="secondary" className="next-game-header" data-testid="next-game-label">
            Next scheduled game:
          </Text>

          <Text strong className="card-title-large" data-testid="game-session-name">
            {name}
          </Text>
        </div>

        <Tag color={statusColor} className="card-status-tag" data-testid="game-status-tag">
          {statusText}
        </Tag>
      </div>

      <div className="card-content">
        <Space direction="vertical" size={4}>
          <Text type="secondary">
            <CalendarOutlined /> Scheduled for
          </Text>
          <Text strong>
            {formattedDate} · {formattedTime}
          </Text>
        </Space>
      </div>

      <div className="card-footer">
        <Button
          type="primary"
          onClick={handleClick}
          disabled={disabled}
          loading={loading}
          icon={<PlayCircleOutlined />}
          block
          data-testid="join-game-button"
        >
          {label}
        </Button>
      </div>
    </Card>
  );
};

export default GameSessionCard;
