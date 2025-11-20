import React from 'react';
import { Modal, Typography, Tag, Descriptions, List, Card, Empty } from 'antd';
import './MatchSettingDetailsPopup.css';

const { Title } = Typography;

const MatchSettingDetailsPopup = ({ visible, onClose, matchSetting }) => {
  if (!matchSetting) return null;

  // Mock data for tests as they are not yet available in the API
  const publicTests = [
    { id: 1, input: "Input A", output: "Output A" },
    { id: 2, input: "Input B", output: "Output B" },
  ];

  const privateTests = [
    { id: 1, input: "Hidden 1", output: "Hidden 1" },
    { id: 2, input: "Hidden 2", output: "Hidden 2" },
  ];

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
          {publicTests.length > 0 ? (
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={publicTests}
              renderItem={item => (
                <List.Item>
                  <Card size="small" title={`Test Case ${item.id}`}>
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
          {privateTests.length > 0 ? (
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={privateTests}
              renderItem={item => (
                <List.Item>
                  <Card size="small" title={`Test Case ${item.id}`}>
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
