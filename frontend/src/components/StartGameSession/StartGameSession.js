import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, List, Spin, Alert, Button, Tooltip, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useStartGameSession } from "./hooks/useStartGameSession";
import "./StartGameSession.css";

const { Title, Text } = Typography;

const StartGameSession = () => {
    const navigate = useNavigate();
    const { session, loading, error, remainingTime, currentPhase } = useStartGameSession();

    if (loading && !session) {
        return <div className="loading-container"><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    if (!session) return null;

    const getPhaseLabel = () => {
        switch (currentPhase) {
            case 1:
                return <Tag color="blue">Phase 1 - Coding</Tag>;
            case 2:
                return <Tag color="orange">Phase 2 - Review</Tag>;
            case 0:
                return <Tag color="green">Session Ended</Tag>;
            default:
                return null;
        }
    };

    const getPhaseDescription = () => {
        switch (currentPhase) {
            case 1:
                return "Students are solving the coding challenge";
            case 2:
                return "Students are reviewing each other's solutions";
            case 0:
                return "The game session has ended";
            default:
                return "";
        }
    };

    return (
        <div className="start-session-container">
            <Card className="session-card-dark">
                <div className="header-section">
                    <div className="header-top">
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
                        <Title level={2} style={{ color: '#333', margin: 0 }}>{session.name}</Title>
                        <div style={{ width: 40 }}></div> {/* Spacer for centering */}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        {getPhaseLabel()}
                    </div>
                    <div className="timer-large" id="timer-large">
                        {remainingTime}
                    </div>
                    <Text className="subtitle" id="student-answered">
                        {getPhaseDescription()}
                    </Text>
                </div>

                <div className="student-list-section" id="student-list">
                    <Text strong className="list-title">Student list ({session.students.length} students)</Text>
                    <List
                        grid={{ gutter: 16, column: 2 }}
                        dataSource={session.students}
                        renderItem={(student) => (
                            <List.Item>
                                <Text className="student-name">
                                    {student.first_name} {student.last_name}
                                </Text>
                            </List.Item>
                        )}
                    />
                </div>
            </Card>
        </div>
    );
};

export default StartGameSession;
