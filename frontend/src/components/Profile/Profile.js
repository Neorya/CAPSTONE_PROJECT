import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Tag, Divider, Space, Skeleton, Statistic, Empty } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    TrophyOutlined,
    CodeOutlined,
    BookOutlined,
    SafetyCertificateOutlined,
    CalendarOutlined,
    StarOutlined
} from '@ant-design/icons';
import { getUserProfile } from '../../services/userService';
import './Profile.css';

const { Title, Text } = Typography;

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="profile-container">
                <Skeleton active avatar paragraph={{ rows: 10 }} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="profile-container">
                <Card className="error-card">
                    <Empty description={error || "Profile not found"} />
                </Card>
            </div>
        );
    }

    const {
        first_name,
        last_name,
        email,
        role,
        score,
        rank,
        profile_url,
        total_matches_played,
        total_tests_passed,
        total_tests_run,
        total_matches_created,
        total_sessions_created
    } = profile;

    const fullName = `${first_name} ${last_name}`;

    return (
        <div className="profile-container">
            {/* Header Section */}
            <Card className="profile-header-card">
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} sm={6} md={4} className="avatar-col">
                        <Avatar
                            size={120}
                            icon={<UserOutlined />}
                            src={profile_url}
                            className="profile-avatar shadow-sm"
                        />
                    </Col>
                    <Col xs={24} sm={18} md={20}>
                        <div className="profile-info-header">
                            <Space direction="vertical" size={4}>
                                <div className="name-role-row">
                                    <Title level={2} style={{ margin: 0 }}>{fullName}</Title>
                                    <Tag color={role === 'admin' ? 'red' : role === 'teacher' ? 'green' : 'blue'} className="role-tag">
                                        {role.toUpperCase()}
                                    </Tag>
                                </div>
                                <Space className="contact-info">
                                    <Text type="secondary"><MailOutlined /> {email}</Text>
                                </Space>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]} className="profile-content-row">
                {/* Main Stats Column */}
                <Col xs={24} md={16}>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card className="stat-card">
                                <Statistic
                                    title="Global Rank"
                                    value={rank || 'N/A'}
                                    prefix={<TrophyOutlined className="stat-icon trophy" />}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="stat-card">
                                <Statistic
                                    title="Total Score"
                                    value={score}
                                    prefix={<StarOutlined className="stat-icon score" />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="stat-card">
                                <Statistic
                                    title="Matches"
                                    value={total_matches_played}
                                    prefix={<CodeOutlined className="stat-icon matches" />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card className="activity-card" title="Performance Overview">
                        <Row gutter={48}>
                            <Col span={12}>
                                <div className="detailed-stat">
                                    <Text type="secondary">Tests Run</Text>
                                    <Title level={3}>{total_tests_run}</Title>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="detailed-stat">
                                    <Text type="secondary">Success Rate</Text>
                                    <Title level={3}>
                                        {total_tests_run > 0 ? `${Math.round((total_tests_passed / total_tests_run) * 100)}%` : '0%'}
                                    </Title>
                                    <Divider style={{ margin: '8px 0' }} />
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill success" style={{ width: total_tests_run > 0 ? `${(total_tests_passed / total_tests_run) * 100}%` : '0%' }}></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {role === 'teacher' && (
                        <Card className="teacher-stats-card" title="Teaching Achievements">
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Space align="center">
                                        <BookOutlined className="stat-icon-small" />
                                        <div>
                                            <Text strong>{total_matches_created}</Text>
                                            <br />
                                            <Text type="secondary" size="small">Matches Created</Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={12}>
                                    <Space align="center">
                                        <CalendarOutlined className="stat-icon-small" />
                                        <div>
                                            <Text strong>{total_sessions_created}</Text>
                                            <br />
                                            <Text type="secondary" size="small">Game Sessions</Text>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Col>

                {/* Sidebar Column */}
                <Col xs={24} md={8}>
                    <Card title="Skills & Badges" className="badges-card">
                        <Empty description="Coming Soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>

                    <Card title="Account Info" className="info-card" style={{ marginTop: 24 }}>
                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            <div className="info-item">
                                <Text type="secondary">Member Since</Text>
                                <div><Text strong>January 2025</Text></div>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
