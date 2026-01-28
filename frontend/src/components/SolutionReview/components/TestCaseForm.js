import React from 'react';
import { Typography, Input, Row, Col } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TestCaseForm = ({ testInput, expectedOutput, isPhaseEnded, onTestInputChange, onExpectedOutputChange }) => {
    return (
        <div id="test-case-form" data-testid="test-case-form" className="test-case-section">
            <Title level={5}>Proposed Test Case (Incorrect Code)</Title>
            <Row gutter={16}>
                <Col span={12}>
                    <Text type="secondary">Input</Text>
                    <TextArea
                        id="test-case-input"
                        rows={3}
                        value={testInput}
                        onChange={onTestInputChange}
                        placeholder="Enter test input"
                        disabled={isPhaseEnded}
                        style={{ marginTop: 8, fontFamily: 'monospace' }}
                    />
                </Col>
                <Col span={12}>
                    <Text type="secondary">Expected Output</Text>
                    <TextArea
                        id="test-case-expected-output"
                        rows={3}
                        value={expectedOutput}
                        onChange={onExpectedOutputChange}
                        placeholder="Enter expected output"
                        disabled={isPhaseEnded}
                        style={{ marginTop: 8, fontFamily: 'monospace' }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default TestCaseForm;
