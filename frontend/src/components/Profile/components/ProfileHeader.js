import React from 'react';
import { Card, Row, Col, Avatar, Typography, Tag, Space, Button } from 'antd';
import { MailOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * ProfileHeader - Displays user avatar, name, role and contact info
 * 
 * @param {Object} props
 * @param {Object} props.profile - User profile data
 * @param {Function} props.onEditClick - Callback for edit button click
 * @returns {JSX.Element} Profile header card
 */
const ProfileHeader = ({ profile, onEditClick }) => {
  const { first_name, last_name, email, role } = profile;
  const fullName = `${first_name} ${last_name}`;
  const initials = `${first_name[0]}${last_name[0]}`.toUpperCase();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'teacher':
        return 'green';
      default:
        return 'blue';
    }
  };

  return (
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
                <Tag color={getRoleColor(role)} className="role-tag">
                  {role.toUpperCase()}
                </Tag>
              </div>
              <Space className="contact-info">
                <Text type="secondary"><MailOutlined /> {email}</Text>
              </Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={onEditClick} 
                style={{ marginTop: 16 }}
              >
                Edit Profile
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileHeader;
