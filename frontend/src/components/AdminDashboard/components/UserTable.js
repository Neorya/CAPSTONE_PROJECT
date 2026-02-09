import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { RocketOutlined, ArrowDownOutlined } from '@ant-design/icons';

const UserTable = ({ users, loading, handlePromote, handleDemote }) => {
    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (_, record) => `${record.first_name} ${record.last_name}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                let color = 'geekblue';
                if (role === 'admin') color = 'volcano';
                if (role === 'teacher') color = 'green';
                return (
                    <Tag color={color} key={role}>
                        {role.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.role === 'student' && (
                        <Popconfirm
                            title="Promote to Teacher?"
                            onConfirm={() => handlePromote(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" size="small" icon={<RocketOutlined />}>
                                Promote
                            </Button>
                        </Popconfirm>
                    )}
                    {record.role === 'teacher' && (
                        <Popconfirm
                            title="Demote to Student?"
                            onConfirm={() => handleDemote(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger size="small" icon={<ArrowDownOutlined />}>
                                Demote
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default UserTable;
