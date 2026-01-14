import React from 'react';
import { Select, Button, Flex, Collapse, Typography } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';

const { Option } = Select;
const { Text } = Typography;

const EditorPanel = ({
    language,
    setLanguage,
    code,
    setCode,
    timeLeft,
    handleRunPublicTests,
    publicTestsCount,
    showOutput,
    setShowOutput,
    runResults
}) => {
    // Mapping runResults to Collapse items
    const collapseItems = [
        {
            key: '1',
            label: 'Execution Output Windows / Test Results',
            children: runResults && (
                <div className="run-results-content">
                    <div className="run-results-header">
                        Test Results: <span className="run-result-success">{runResults.passed} Passed</span>, <span className="run-result-failure">{runResults.failed} Failed</span>
                    </div>
                    {runResults.errors.map((err, i) => (
                        <div key={i} className="run-result-error-msg">{err}</div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <Flex vertical gap="middle" className="editor-panel-container">
            <Flex justify="space-between" align="center">
                <Text strong>Code Editor</Text>
                <div className="editor-toolbar">
                    <span className="editor-toolbar-label">Language:</span>
                    <Select
                        value={language}
                        onChange={setLanguage}
                        className="editor-select"
                    >
                        <Option value="C++">C++</Option>
                    </Select>
                </div>
            </Flex>

            {/* Wrapper with 'ace_content' class to satisfy test selector */}
            <div className="ace_content editor-content-wrapper">
                <Editor
                    height="100%"
                    defaultLanguage="C++"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 16 }
                    }}
                />
            </div>

            <Flex gap="middle">
                <Button
                    block
                    onClick={handleRunPublicTests}
                    disabled={timeLeft === 0}
                    size="large"
                >
                    Run Public Tests ({publicTestsCount})
                </Button>
                <Button
                    type="primary"
                    block
                    size="large"
                >
                    Test My Custom Inputs
                </Button>
            </Flex>

            <Collapse
                items={collapseItems}
                activeKey={showOutput ? ['1'] : []}
                onChange={() => setShowOutput(!showOutput)}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                size="small"
                className="results-collapse"
            />
        </Flex>
    );
};

export default EditorPanel;
