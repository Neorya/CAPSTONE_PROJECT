import React from 'react';
import { Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LeaderboardHeader = () => (
    <div className="hall-of-fame-header" id="hall-of-fame-header">
        <div className="header-text-content">
            <div className="title-wrapper">
                <TrophyOutlined className="trophy-icon" id="trophy-icon" />
                <Title level={1} className="page-title" id="page-title">Hall of Fame</Title>
            </div>
            <Text className="page-subtitle" id="page-subtitle">Celebrating our top performers and their achievements</Text>
        </div>
    </div>
);

export default LeaderboardHeader;
