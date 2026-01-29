import React from 'react';
import { Card, Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * AccountInfoCard - Displays account information
 * 
 * @returns {JSX.Element} Account info card component
 */
const AccountInfoCard = () => {
  return (
    <Card title="Account Info" className="info-card" style={{ marginTop: 24 }}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div className="info-item">
          <Text type="secondary">Member Since</Text>
          <div><Text strong>January 2025</Text></div>
        </div>
        {/* ID is hidden as per requirements */}
      </Space>
    </Card>
  );
};

export default AccountInfoCard;
