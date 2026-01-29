import React from 'react';
import { Card, Row, Col, Typography, Statistic, Divider } from 'antd';
import { TrophyOutlined, StarOutlined, CodeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * StudentStats - Displays statistics for student users
 * 
 * @param {Object} props
 * @param {Object} props.profile - Student profile data
 * @returns {JSX.Element} Student statistics section
 */
const StudentStats = ({ profile }) => {
  const {
    score,
    rank,
    total_matches_played,
    total_tests_passed,
    total_tests_run,
  } = profile;

  const successRate = total_tests_run > 0
    ? Math.round((total_tests_passed / total_tests_run) * 100)
    : 0;

  return (
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
            </div>
          </Col>
          <Col span={12}>
            <div className="detailed-stat">
              <Text type="secondary">Success Rate</Text>
              <Title level={3}>{successRate}%</Title>
              <Divider style={{ margin: '8px 0' }} />
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill success" 
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default StudentStats;
