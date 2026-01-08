import React from 'react';
import { Tag, Collapse, Typography, Space, theme } from 'antd';
import {
    DeleteOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const TestCaseItem = ({ test, label, onDelete }) => {
    const { token } = theme.useToken();

    const getStatusIcon = () => {
        if (test.status === 'passed') return <CheckCircleFilled style={{ color: token.colorSuccess }} />;
        if (test.status === 'failed') return <CloseCircleFilled style={{ color: token.colorError }} />;
        return <ClockCircleOutlined style={{ color: token.colorTextDisabled }} />;
    };

    const getStatusTag = () => {
        if (test.status === 'passed') return <Tag color="success">Passed</Tag>;
        if (test.status === 'failed') return <Tag color="error">Failed</Tag>;
        return <Tag color="default">Not Run</Tag>;
    };

    const genExtra = () => (
        <Space onClick={(event) => event.stopPropagation()}>
            {getStatusTag()}
            {onDelete && (
                <i className="fa-trash test-case-delete-icon" onClick={onDelete} style={{ color: token.colorError }}>
                    <DeleteOutlined />
                </i>
            )}
        </Space>
    );

    const items = [
        {
            key: '1',
            label: (
                <Space>
                    {getStatusIcon()}
                    <Text strong>{label}</Text>
                </Space>
            ),
            children: (
                <Space direction="vertical" className="test-case-children">
                    <Space>
                        <Text strong>Input:</Text>
                        <Text code>{test.input}</Text>
                    </Space>
                    <Space>
                        <Text strong>Expected:</Text>
                        <Text code>{test.expected}</Text>
                    </Space>
                    {test.actual && (
                        <Space>
                            <Text strong>Actual:</Text>
                            <Text code type={test.status === 'passed' ? 'success' : 'danger'}>
                                {test.actual}
                            </Text>
                        </Space>
                    )}
                </Space>
            ),
            extra: genExtra(),
        },
    ];

    return (
        <Collapse
            items={items}
            size="small"
            className="test-case-item-container"
            style={{ background: token.colorFillAlter }}
        />
    );
};

export default TestCaseItem;
