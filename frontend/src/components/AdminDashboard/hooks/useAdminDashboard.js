import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getUsers, promoteUserToTeacher, demoteUserToStudent } from '../../../services/adminService';

export const useAdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            message.error(error.message || "Error loading users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handlePromote = async (userId) => {
        try {
            await promoteUserToTeacher(userId);
            message.success('User promoted to Teacher');
            fetchUsers();
        } catch (error) {
            message.error(error.message || "Error promoting user");
        }
    };

    const handleDemote = async (userId) => {
        try {
            await demoteUserToStudent(userId);
            message.success('User demoted to Student');
            fetchUsers();
        } catch (error) {
            message.error(error.message || "Error demoting user");
        }
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const email = user.email.toLowerCase();
        const searchLower = searchText.toLowerCase();

        const matchesSearch = fullName.includes(searchLower) || email.includes(searchLower);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return {
        users: filteredUsers,
        loading,
        searchText,
        setSearchText,
        roleFilter,
        setRoleFilter,
        handlePromote,
        handleDemote,
        refreshUsers: fetchUsers
    };
};
