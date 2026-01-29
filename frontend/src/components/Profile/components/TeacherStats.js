import React from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import { BookOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * TeacherStats - Displays statistics for teacher users
 * 
 * @param {Object} props
 * @param {Object} props.profile - Teacher profile data
 * @returns {JSX.Element} Teacher statistics section
 */
const TeacherStats = ({ profile }) => {
  const { total_matches_created, total_sessions_created } = profile;

  return (
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
  );
};

export default TeacherStats;
