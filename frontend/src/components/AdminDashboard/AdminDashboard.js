import React from 'react';
import { Card, Typography } from 'antd';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';

const { Title } = Typography;

const AdminDashboard = () => {
    const {
        users,
        loading,
        searchText,
        setSearchText,
        roleFilter,
        setRoleFilter,
        handlePromote,
        handleDemote
    } = useAdminDashboard();

    return (
        <Card style={{ margin: '20px' }}>
            <Title level={2}>User Management</Title>

            <UserFilters
                searchText={searchText}
                setSearchText={setSearchText}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
            />

            <UserTable
                users={users}
                loading={loading}
                handlePromote={handlePromote}
                handleDemote={handleDemote}
            />
        </Card>
    );
};

export default AdminDashboard;
