import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, List, Avatar, Spin, Tooltip } from "antd";
import { usePreStartGameSession } from "./hooks/usePreStartGameSession";
import AlertNotification from "../CreateMatchForm/components/AlertNotification";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import "./PreStartGameSession.css";

const { Title, Text } = Typography;

const PreStartGameSession = () => {
    const navigate = useNavigate();
    const { session, loading, error, gameId, startSession } = usePreStartGameSession();

    if (!session) { return null; }


    const handleStartSession = async () => {
        const ok = await startSession();   // WAIT for backend
        if (!ok) return;
      
        navigate(`/start-game-session/${gameId}`);
    };


    const formatDateTime = (value) => {
        if (!value) return "-";
      
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
      
        return d.toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
    };
      
      
    const formatMinutes = (mins) => {
        if (mins === null || mins === undefined) return "-";
        return `${mins} min`;
    };
      
      
      
      
    
    return (
        <div className="pre-start-session-container">
            <Card className="session-card">
                {error && (
                    <AlertNotification
                        type="error"
                        message={error}
                        onClose={() => {}}
                    />
                )}
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
                        {/* <Title level={2} style={{ margin: 0 }}>Game Session</Title> */}
                        <div style={{ marginTop: 12 }}>
                            <Title level={2} style={{ margin: 0 }}>
                                Start {session.name} Game Session
                            </Title>
                            </div>
                        <div style={{ width: 40 }}></div> {/* Spacer for centering */}
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

                <div className="section">
                    <Text strong style={{ fontSize: "16px" }}>
                        Session details
                    </Text>

                    <div className="session-details">
                        <div className="detail-row">
                        <Text type="secondary">Scheduled start</Text>
                        <Text strong>{formatDateTime(session.start_date)}</Text>
                        </div>

                        <div className="detail-row">
                        <Text type="secondary">Phase 1 duration</Text>
                        <Text strong>{formatMinutes(session.duration_phase1)}</Text>
                        </div>

                        <div className="detail-row">
                        <Text type="secondary">Phase 2 duration</Text>
                        <Text strong>{formatMinutes(session.duration_phase2)}</Text>
                        </div>
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
