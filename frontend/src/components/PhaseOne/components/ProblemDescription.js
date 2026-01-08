import React from 'react';
import { Typography, Space } from 'antd';

const { Title, Text } = Typography;

const ProblemDescription = ({ title, description }) => {
    return (
        <Space direction="vertical" size="middle" className="problem-description-container">
            <div>
                <Title level={4} className="problem-description-title">{title}</Title>
            </div>

            <Text>{description}</Text>
        </Space>
    );
};

export default ProblemDescription;
