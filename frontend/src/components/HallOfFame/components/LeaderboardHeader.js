import React from 'react';
import { Typography, Button, Tooltip } from 'antd';
import { TrophyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LeaderboardHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="hall-of-fame-header" id="hall-of-fame-header">
            <div className="header-text-content">
                <div className="title-wrapper">
                    <TrophyOutlined className="trophy-icon" id="trophy-icon" />
                    <Title level={1} className="page-title" id="page-title">Hall of Fame</Title>
                </div>
                <Text className="page-subtitle" id="page-subtitle">Celebrating our top performers and their achievements</Text>
            </div>

            <Tooltip title="Back to Home">
                <Button
                    id="back-to-home-button"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/home')}
                    shape="circle"
                    size="large"
                    className="back-button"
                />
            </Tooltip>
        </div>
    );
};

export default LeaderboardHeader;
