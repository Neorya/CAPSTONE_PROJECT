import React from 'react';
import { Button, Card, Typography } from 'antd';

const { Text } = Typography;

// configuration for different button states
const configByState = {
  ready: {
    disabled: false,
    loading: false,
    label: 'Join Game',
  },
  joining: {
    disabled: true,
    loading: true,
    label: 'Joining...',
  },
  alreadyJoined: {
    disabled: true,
    loading: false,
    label: 'Already joined',
  },
  expired: {
    disabled: true,
    loading: false,
    label: 'Session expired',
  }
};


const GameSessionCard = ({ name, time, joinState, onJoin}) => {

  const { disabled, loading, label } = configByState[joinState] || configByState.ready;

  const handleClick = () => {
    if (!disabled && joinState === 'ready') {
      onJoin?.();
    }
  };

  return (
    <Card>
      <div>
        <Text>
          Next scheduled game:
        </Text>
      </div>

      <div>
        <Text strong>
          {name} at {new Date(time).toLocaleString()}
        </Text>
      </div>

      <div>
        <Button
          type="primary"
          onClick={handleClick}
          disabled={disabled}
          loading={loading}
        >
        {label}
        </Button>
      </div>
    </Card>
  );
};

export default GameSessionCard;
