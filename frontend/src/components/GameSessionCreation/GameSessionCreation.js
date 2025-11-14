
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Radio, Select, InputNumber, Button, Alert, Card, Space, Typography, Table } from 'antd';
import { SaveOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { mockMatchSettings, createMatch } from '../../data/mockData';
import './GameSessionCreation.css'

const { Title, Text } = Typography;
const GameSessionCreation = () => {
    const navigate = useNavigate();

    const [selectedRows, setSelectedRows] = useState([]);
    const dataSource = [
        {
            key: '1',
            name: 'Test 1',

        },
        {
            key: '2',
            name: 'Test 2',

        },
    ];

    const mainColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
    ];
    const checkBoxColumns = {
        title: 'Choosed',
        dataIndex: 'choosed',
        key: 'choosed',
        render: (text, record) => (
            <input type="checkbox" onChange={(key, rows) => { setSelectedRows(rows); }} />
        ),

    };

    const columns = [...mainColumns, checkBoxColumns];
    return (
        <div className="match-settings-list-container">
            <Card className="match-settings-card">
                {/* Header */}
                <div className="page-header">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                    <Title level={2} className="page-title">
                        Create Game Session
                    </Title>
                    <span /> {/* spacer to keep title centered */}
                </div>

                {/* Optional helper text */}
                <div className="subheader">
                    <Text type="secondary">
                        Create a new Game Session selecting you desidered matches
                    </Text>
                </div>


                {/* Table */}
                <Table
                    id="game-session-creation-table"
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    rowKey="id"
                    className="match-settings-table"
                    locale={{ emptyText: "No match settings found." }}
                />
                <div className="confirm-button" id="create-game-session-button">
                    <Button onClick={() => navigate("/")}>
                        Create Game Session
                    </Button>
                </div>
            </Card>
        </div>
    );
}
export default GameSessionCreation;
