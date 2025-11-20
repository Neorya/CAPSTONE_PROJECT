import React from 'react';
import { Modal, Typography, Tag, Descriptions, List, Card, Empty } from 'antd';
import './MatchSettingDetailsPopup.css';

const { Title } = Typography;

const MatchSettingDetailsPopup = ({ visible, onClose, matchSetting }) => {
  if (!matchSetting) return null;

  const parseTestString = (testString) => {
    if (!testString) return null;
    // Try to match "Input: ..., Output: ..." pattern
    const match = testString.match(/Input:\s*(.*?),\s*Output:\s*(.*)/i);
    if (match) {
      return { input: match[1], output: match[2] };
    }
  };

  const publicTest = parseTestString(matchSetting.public_test);
  const privateTest = parseTestString(matchSetting.private_test);

  return (
    <Modal
      title={<Title level={3} style={{ margin: 0 }}>{matchSetting.name}</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="match-setting-details-popup"
    >
      <div className="popup-content">
        <div className="status-section">
          <Tag color={matchSetting.status === 'Ready' ? 'success' : 'default'}>
            {matchSetting.status}
          </Tag>
        </div>

        <Descriptions title="Description" bordered column={1}>
          <Descriptions.Item label="Details">
            {matchSetting.description || <span style={{ color: '#999' }}>No description provided</span>}
          </Descriptions.Item>
        </Descriptions>

        <div className="tests-section">
          <Title level={4}>Public Tests</Title>
          {publicTest ? (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={[publicTest]}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" title={`Test Case ${index + 1}`}>
                    <p><strong>Input:</strong> {item.input}</p>
                    <p><strong>Output:</strong> {item.output}</p>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No public tests available" />
          )}
        </div>

        <div className="tests-section">
          <Title level={4}>Private Tests</Title>
          {privateTest ? (
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={[privateTest]}
              renderItem={(item, index) => (
                <List.Item>
                  <Card size="small" title={`Test Case ${index + 1}`}>
                    <p><strong>Input:</strong> {item.input}</p>
                    <p><strong>Output:</strong> {item.output}</p>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No private tests available" />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MatchSettingDetailsPopup;
