import React from 'react';
import { Modal, Typography, Tag, Descriptions, List, Card, Empty } from 'antd';
import Editor from '@monaco-editor/react';
import './MatchSettingDetailsPopup.css';

const { Title } = Typography;

const MatchSettingDetailsPopup = ({ visible, onClose, matchSetting }) => {
  if (!matchSetting) return null;

  // Filter tests by scope
  const publicTests = matchSetting.tests?.filter(t => t.scope === 'public') || [];
  const privateTests = matchSetting.tests?.filter(t => t.scope === 'private') || [];

  // Determine the language for Monaco
  const monacoLanguage = matchSetting.language === 'cpp' ? 'cpp' : matchSetting.language || 'cpp';

  // Format the code for display
  const formatCode = (code) => {
    if (!code) return '';
    return code.replace(/\\n/g, '\n');
  };

  return (
    <Modal
      id="match-details-modal"
      title={<Title level={3} id="popup-header-title" style={{ margin: 0 }}>{matchSetting.name}</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="match-setting-details-popup"
    >
      <div className="popup-content">
        <div className="status-section">
          <Tag
            id="popup-status-tag"
            color={matchSetting.status === 'Ready' ? 'success' : 'default'}
          >
            {matchSetting.status}
          </Tag>
        </div>

        {/* Description */}
        <div className="popup-section">
          <div className="popup-section-label">Description</div>
          <div className="popup-section-body" id="popup-description-text">
            {matchSetting.description || <span className="popup-empty-text">No description provided</span>}
          </div>
        </div>

        {/* Reference Solution */}
        <div className="popup-section">
          <div className="popup-section-label">Reference Solution</div>
          <div className="popup-code-editor" id="popup-reference-solution-editor">
            <Editor
              height="250px"
              language={monacoLanguage}
              value={formatCode(matchSetting.reference_solution)}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                domReadOnly: true,
                renderLineHighlight: 'none',
                contextmenu: false,
              }}
            />
          </div>
        </div>

        {/* Student Boilerplate */}
        {matchSetting.student_code && (
          <div className="popup-section">
            <div className="popup-section-label">Student Boilerplate</div>
            <div className="popup-code-editor" id="popup-student-code-editor">
              <Editor
                height="180px"
                language={monacoLanguage}
                value={formatCode(matchSetting.student_code)}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  domReadOnly: true,
                  renderLineHighlight: 'none',
                  contextmenu: false,
                }}
              />
            </div>
          </div>
        )}




        {/* Test Cases */}
        <div className="popup-tests-row">
          <div className="popup-tests-column">
            <div className="popup-section-label">
              Public Tests
              <Tag style={{ marginLeft: 8 }}>{publicTests.length}</Tag>
            </div>
            {publicTests.length > 0 ? (
              <div className="popup-test-cards">
                {publicTests.map((item, index) => (
                  <div key={index} className="popup-test-card" id={`public-test-card-${index}`}>
                    <div className="popup-test-card-header">Test {index + 1}</div>
                    <div className="popup-test-card-body">
                      <div className="popup-test-field">
                        <span className="popup-test-label">Input</span>
                        <code className="popup-test-value" id={`public-test-${index}-input`}>{item.test_in || '—'}</code>
                      </div>
                      <div className="popup-test-field">
                        <span className="popup-test-label">Expected</span>
                        <code className="popup-test-value" id={`public-test-${index}-output`}>{item.test_out}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="No public tests" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>

          <div className="popup-tests-column">
            <div className="popup-section-label">
              Private Tests
              <Tag style={{ marginLeft: 8 }}>{privateTests.length}</Tag>
            </div>
            {privateTests.length > 0 ? (
              <div className="popup-test-cards">
                {privateTests.map((item, index) => (
                  <div key={index} className="popup-test-card">
                    <div className="popup-test-card-header">Test {index + 1}</div>
                    <div className="popup-test-card-body">
                      <div className="popup-test-field">
                        <span className="popup-test-label">Input</span>
                        <code className="popup-test-value">{item.test_in || '—'}</code>
                      </div>
                      <div className="popup-test-field">
                        <span className="popup-test-label">Expected</span>
                        <code className="popup-test-value">{item.test_out}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="No private tests" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MatchSettingDetailsPopup;
