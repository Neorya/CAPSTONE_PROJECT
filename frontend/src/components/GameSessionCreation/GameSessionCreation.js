import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Table, message, Checkbox } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './GameSessionCreation.css';

const { Title, Text } = Typography;

const GameSessionCreation = () => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);

    const handleCheckboxChange = (record, checked) => {
        if (checked) {
            setSelectedRows(prev => [...prev, record]);
        } else {
            setSelectedRows(prev => prev.filter(item => item.key !== record.key));
        }
    };

    const handleCreateSession = () => {
        if (selectedRows.length === 0) {
            alert("You should select at least a match to create a game session");
            return;
        }
        alert("The game session has been created");
        navigate("/");
    };

    const dataSource = [
        { key: '1', name: 'Test 1' },
        { key: '2', name: 'Test 2' },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Selected',
            key: 'select',
            render: (_, record) => {
                const isSelected = selectedRows.some(item => item.key === record.key);
                return (
                    <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleCheckboxChange(record, e.target.checked)}
                    />
                );
            },
        },
    ];

    return (
        <div className="match-settings-list-container">
            <Card className="match-settings-card">
                <div className="page-header">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                    <Title level={2} id="page_title" className="page-title">
                        Create Game Session
                    </Title>
                    <span />
                </div>

                <div className="subheader">
                    <Text type="secondary">
                        Create a new Game Session selecting your desired matches
                    </Text>
                </div>

                <Table
                    id="game-session-creation-table"
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    rowKey="key"
                    className="match-settings-table"
                    locale={{ emptyText: "No match settings found." }}
                />
                
                <div className="confirm-button" id="create-game-session-button">
                    <Button type="primary" onClick={handleCreateSession}>
                        Create Game Session
                    </Button>
                </div>
            </Card>
        </div>
    );
};
export default GameSessionCreation;
