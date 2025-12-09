import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, List, Avatar, Spin, Alert, Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { usePreStartGameSession } from "./hooks/usePreStartGameSession";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import "./PreStartGameSession.css";

const { Title, Text } = Typography;

const PreStartGameSession = () => {
    const navigate = useNavigate();
    const { session, loading, error, gameId, elapsedTime } = usePreStartGameSession();


    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }
   
    if (!session) { console.log("indefiniito"); return null; }

    const handleStartSession = () => {
        navigate(`/start-game-session`);
    };
    
    return (
        <div className="pre-start-session-container">
            <Card className="session-card">
                <div className="header-section">
                    <div className="header-top">
                        <Tooltip title="Back to Home">
                            <Button 
                                id="back-to-home-button"
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => navigate('/')}
                                shape="circle"
                                size="large"
                                className="back-button"
                            />
                        </Tooltip>
                        <Title level={2} style={{ margin: 0 }}>Game Session</Title>
                        <div style={{ width: 40 }}></div> {/* Spacer for centering */}
                    </div>
                    <div className="timer-display">
                        <ClockCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text strong style={{ fontSize: '18px' }}>{elapsedTime}</Text>
                    </div>
                </div>

                <div className="section">
                    <Text strong style={{ fontSize: '16px' }}>{session.students.length} students joined</Text>
                    <List
                        className="students-list"
                        itemLayout="horizontal"
                        dataSource={session.students}
                        renderItem={(student) => (
                            <List.Item style={{ padding: '8px 0', border: 'none' }}>
                                <List.Item.Meta
                                    avatar={
                                        <Avatar style={{ backgroundColor: '#f56a00' }}>
                                            {student.first_name[0]}
                                        </Avatar>
                                    }
                                    title={<Text>{student.first_name} {student.last_name}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </div>

                <div className="section">
                    <Text strong style={{ fontSize: '16px' }}>Matches</Text>
                    <div className="matches-list">
                        {session.matches.map(match => (
                            <div key={match.match_id} className="match-item">
                                {match.title}
                            </div>
                        ))}
                    </div>
                </div>

                <Button 
                    type="primary" 
                    size="large" 
                    block 
                    onClick={handleStartSession}
                    className="start-button"
                    id = "start_game_button"
                    style={{ marginTop: '20px', height: '50px', fontSize: '18px' }}
                >
                    Start session
                </Button>
            </Card>
        </div>
    );
};

export default PreStartGameSession;
