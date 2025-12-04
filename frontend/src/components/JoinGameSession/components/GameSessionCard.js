import React from 'react';
import { Button, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const GameSessionCard = ({ name, time, onJoin, loading }) => {
  return (
    <Card>
      <div>
        <Text>
          Next scheduled game:
        </Text>
      </div>

      <div>
        <Text strong>
          {name} at {time}
        </Text>
      </div>

      <div>
        <Button
          type="primary"
          onClick={onJoin}
          disabled={!onJoin}
          loading={loading}
        >
          {onJoin ? 'Join Game' : 'Session Expired'}
        </Button>
      </div>
    </Card>
  );
};

export default GameSessionCard;
