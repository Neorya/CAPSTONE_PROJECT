import React from 'react';
import { Card, Typography, Input, Button, Divider } from 'antd';
import Editor from '@monaco-editor/react';
import VotingSection from './VotingSection';
import TestCaseForm from './TestCaseForm';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReviewPanel = ({
    selectedSolution,
    voteType,
    testInput,
    expectedOutput,
    notes,
    isPhaseEnded,
    isSubmitEnabled,
    onVoteChange,
    onTestInputChange,
    onExpectedOutputChange,
    onNotesChange,
    onSubmit
}) => {
    if (!selectedSolution) {
        return (
            <Card className="empty-state-card" bordered={false}>
                <div className="empty-state">
                    <Title level={4}>No Solution Selected</Title>
                    <Paragraph type="secondary">
                        Select a solution from the left panel to review and vote
                    </Paragraph>
                </div>
            </Card>
        );
    }

    return (
        <Card className="review-panel-card" bordered={false}>
            {/* Code Editor */}
            <div className="code-section">
                <div id="code-editor-readonly" data-testid="code-editor-readonly" className="monaco-editor-wrapper" readonly="true">
                    <Editor
                        height="100%"
                        defaultLanguage="cpp"
                        value={selectedSolution.code}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            theme: 'vs-dark',
                            lineNumbers: 'on',
                            automaticLayout: true
                        }}
                    />
                </div>
            </div>

            <Divider />

            {/* Voting Section */}
            <VotingSection
                voteType={voteType}
                isPhaseEnded={isPhaseEnded}
                onVoteChange={onVoteChange}
            />

            {/* Notes */}
            <div className="notes-section">
                <Text type="secondary">Notes</Text>
                <TextArea
                    id="review-notes"
                    rows={2}
                    placeholder="Add any notes about this solution (optional)"
                    value={notes}
                    onChange={onNotesChange}
                    disabled={isPhaseEnded}
                    style={{ marginTop: 8 }}
                />
            </div>

            {/* Test Case Form - Only visible when Incorrect is selected */}
            {voteType === 'incorrect' && (
                <TestCaseForm
                    testInput={testInput}
                    expectedOutput={expectedOutput}
                    isPhaseEnded={isPhaseEnded}
                    onTestInputChange={onTestInputChange}
                    onExpectedOutputChange={onExpectedOutputChange}
                />
            )}

            {/* Submit Button */}
            <div className="action-buttons" style={{ marginTop: 24 }}>
                <Button
                    id="submit-vote-button"
                    type="primary"
                    size="large"
                    onClick={onSubmit}
                    disabled={!isSubmitEnabled || isPhaseEnded}
                    block
                >
                    Submit Review
                </Button>
            </div>
        </Card>
    );
};

export default ReviewPanel;
