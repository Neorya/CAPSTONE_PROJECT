import React from 'react';
import { Card, Typography } from 'antd';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
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
    const navigate = useNavigate();
    return (
        <Card style={{ margin: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <Title level={2} style={{ margin: 0 }}>User Management</Title>

                <Tooltip title="Back to Home">
                    <Button
                        id="back-to-home-button"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/home')}
                        shape="circle"
                        size="large"
                    />
                </Tooltip>
            </div>

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
