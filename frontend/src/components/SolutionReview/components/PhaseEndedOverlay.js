import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const PhaseEndedOverlay = () => {
    return (
        <div className="phase-ended-overlay">
            <Card className="phase-ended-card">
                <Title level={3} type="danger">Phase 2 Closed</Title>
                <Paragraph>The voting phase has ended. All voting inputs are now disabled.</Paragraph>
            </Card>
        </div>
    );
};

export default PhaseEndedOverlay;
