import React from 'react';
import { Space, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserFilters = ({ searchText, setSearchText, roleFilter, setRoleFilter }) => {
    return (
        <Space style={{ marginBottom: 16 }}>
            <Input
                placeholder="Search by name or email"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 250 }}
            />
            <Select
                defaultValue="all"
                value={roleFilter}
                onChange={value => setRoleFilter(value)}
                style={{ width: 120 }}
            >
                <Option value="all">All Roles</Option>
                <Option value="student">Student</Option>
                <Option value="teacher">Teacher</Option>
                <Option value="admin">Admin</Option>
            </Select>
        </Space>
    );
};

export default UserFilters;
