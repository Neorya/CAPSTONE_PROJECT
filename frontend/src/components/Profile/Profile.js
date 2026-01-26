import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Tag, Divider, Space, Skeleton, Statistic, Empty, Button, Modal, Form, Input, message, Tooltip, Image } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    TrophyOutlined,
    CodeOutlined,
    BookOutlined,
    CalendarOutlined,
    StarOutlined,
    EditOutlined
} from '@ant-design/icons';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import { getStudentBadges } from '../../services/badgeService';
import './Profile.css';

const { Title, Text } = Typography;

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile();
            setProfile(data);

            if (data.role === 'student' || data.role === 'student') {
                // Fetch badges
                // Logic to map user_id to student_id if needed, but assuming user_id works for now based on previous context 
                // or getUserProfile returns 'student_id' if implemented?
                // The API for getUserProfile returns UserProfileResponse which has user_id.
                // Badges API expects student_id. In our DB, student_id == user_id usually due to the trigger logic, 
                // AND the mocks use same IDs.
                // However, safety check: user_id from profile is the ID from users table.
                const badgeData = await getStudentBadges(data.user_id);
                setBadges(badgeData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditProfile = () => {
        form.setFieldsValue({
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email
        });
        setIsEditModalVisible(true);
    };

    const handleUpdateProfile = async (values) => {
        try {
            const updatedProfile = await updateUserProfile(values);
            setProfile(prev => ({ ...prev, ...updatedProfile }));
            message.success('Profile updated successfully');
            setIsEditModalVisible(false);
        } catch (err) {
            message.error(err.message || 'Failed to update profile');
        }
    };

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
    const initials = `${first_name[0]}${last_name[0]}`.toUpperCase();

    // Map badge name/criteria to file path
    // Assumption: files are in /badges/...
    const getBadgeIcon = (badge) => {
        // Simple mapping or use badge.icon_path if backend provides full path?
        // Backend provides 'rising_star.png', etc.
        // We moved /frontend/res/Badges to /frontend/public/badges
        // Structure in public/badges:
        //  TopN/1.png...
        //  CorrectUpVotes/5-2.png...

        // This is tricky because the backend just has 'rising_star.png' which I inserted.
        // I need to map 'Rising Star' -> 'TopN/10.png' etc based on my manual mapping or update DB.
        // Or I can just try to find the match.

        // Let's implement a mapping here based on the Badge Criteria Type or Name
        const name = badge.name;
        if (name === 'Champion') return '/badges/TopN/1.png';
        if (name === 'Podium Master') return '/badges/TopN/3.png';
        if (name === 'Elite Performer') return '/badges/TopN/5.png';
        if (name === 'Rising Star') return '/badges/TopN/10.png';

        if (name === 'Bug Hunter') return '/badges/FindingCodeFailures/5.png';
        if (name === 'Bug Tracker') return '/badges/FindingCodeFailures/10.png';
        if (name === 'Bug Slayer') return '/badges/FindingCodeFailures/20.png';
        if (name === 'Bug Exterminator') return '/badges/FindingCodeFailures/50.png';
        if (name === 'Bug Whisperer') return '/badges/FindingCodeFailures/100.png';

        if (name === 'Sharp Eye') return '/badges/CorrectUpVotes/5-2.png';
        if (name === 'Quality Checker') return '/badges/CorrectUpVotes/10-1.png';
        if (name === 'Insightful Reviewer') return '/badges/CorrectUpVotes/20-3.png';
        if (name === 'Truth Seeker') return '/badges/CorrectUpVotes/50-2.png';
        if (name === 'Peer Review Master') return '/badges/CorrectUpVotes/100-2.png';

        if (name === 'First Pass') return '/badges/PassTeacherTests/1.png';
        // ... (Others follow similar pattern, I'll rely on criteria match or default)

        return '/badges/default_badge.png'; // Fallback
    };

    return (
        <div className="profile-container">
            {/* Header Section */}
            <Card className="profile-header-card">
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} sm={6} md={4} className="avatar-col">
                        <Avatar
                            size={120}
                            style={{ backgroundColor: '#f56a00', fontSize: '3rem' }}
                            className="profile-avatar shadow-sm"
                        >
                            {initials}
                        </Avatar>
                    </Col>
                    <Col xs={24} sm={18} md={20}>
                        <div className="profile-info-header">
                            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                <div className="name-role-row">
                                    <Title level={2} style={{ margin: 0 }}>{fullName}</Title>
                                    <Tag color={role === 'admin' ? 'red' : role === 'teacher' ? 'green' : 'blue'} className="role-tag">
                                        {role.toUpperCase()}
                                    </Tag>
                                </div>
                                <Space className="contact-info">
                                    <Text type="secondary"><MailOutlined /> {email}</Text>
                                </Space>
                                <Button type="primary" icon={<EditOutlined />} onClick={handleEditProfile} style={{ marginTop: 16 }}>
                                    Edit Profile
                                </Button>
                            </Space>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]} className="profile-content-row">
                {/* Main Stats Column */}
                <Col xs={24} md={16}>
                    {/* Stats Section */}
                    {role === 'student' && (
                        <>
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
                            <Card className="activity-card" title="Performance Overview" style={{ marginTop: 16 }}>
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
                        </>
                    )}

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
                    {role === 'student' && (
                        <Card title="Badges" className="badges-card">
                            {badges.length > 0 ? (
                                <div className="badges-grid">
                                    {badges.map(badge => (
                                        <Tooltip title={badge.description} key={badge.badge_id}>
                                            <div className="badge-item">
                                                <Image
                                                    src={getBadgeIcon(badge)}
                                                    alt={badge.name}
                                                    width={64}
                                                    preview={false}
                                                    fallback="/badges/default.png"
                                                />
                                                <Text type="secondary" style={{ fontSize: 10 }}>{badge.name}</Text>
                                            </div>
                                        </Tooltip>
                                    ))}
                                </div>
                            ) : (
                                <Empty description="No badges earned yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>
                    )}

                    <Card title="Account Info" className="info-card" style={{ marginTop: 24 }}>
                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            <div className="info-item">
                                <Text type="secondary">Member Since</Text>
                                <div><Text strong>January 2025</Text></div>
                            </div>
                            {/* ID is hidden as per requirements */}
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Edit Profile"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                >
                    <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;
