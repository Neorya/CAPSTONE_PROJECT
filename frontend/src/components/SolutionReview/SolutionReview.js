import React, { useState } from 'react';
import { Row, Col, message } from 'antd';
import { useSolutionReview } from './hooks/useSolutionReview';
import { SolutionsList, ReviewPanel, PhaseEndedOverlay } from './components';
import './SolutionReview.css';

/**
 * Container Component for Solution Review Phase
 * Manages state and business logic, delegates rendering to presentational components
 */
const SolutionReview = () => {
    // Custom hook for solution review data and actions
    const {
        solutions,
        selectedSolution,
        remainingTime,
        isPhaseEnded,
        selectSolution,
        submitVote
    } = useSolutionReview();

    // Local UI state
    const [voteType, setVoteType] = useState(null);
    const [testInput, setTestInput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [notes, setNotes] = useState('');
    const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

    // Event Handlers
    const handleSolutionClick = (solutionId) => {
        selectSolution(solutionId);
        resetForm();
    };

    const handleVoteChange = (e) => {
        setVoteType(e.target.value);
        if (e.target.value !== 'incorrect') {
            setTestInput('');
            setExpectedOutput('');
        }
    };

    const handleTogglePanel = () => {
        setIsLeftPanelCollapsed((prev) => !prev);
    };

    const resetForm = () => {
        setVoteType(null);
        setTestInput('');
        setExpectedOutput('');
        setNotes('');
    };

    // Validation
    const isSubmitEnabled = () => {
        if (!voteType) return false;
        if (voteType === 'incorrect') {
            return testInput.trim() !== '' && expectedOutput.trim() !== '';
        }
        return true;
    };

    const validateTestCase = (input, output) => {
        if (input === 'InvalidInputForTeacher' && output === 'ImpossibleOutput') {
            message.error('Invalid Test Case: Teacher\'s solution does not match expected output');
            return false;
        }
        return true;
    };

    // Submit Handler
    const handleSubmit = () => {
        if (!selectedSolution || !isSubmitEnabled()) return;

        const testCase = voteType === 'incorrect'
            ? { input: testInput, expectedOutput }
            : null;

        // Validate test case if voting incorrect
        if (voteType === 'incorrect' && !validateTestCase(testInput, expectedOutput)) {
            return;
        }

        const success = submitVote(selectedSolution.id, voteType, testCase);

        if (success) {
            message.success('Vote Submitted Successfully');
            resetForm();
        }
    };

    return (
        <div className="solution-review-container">
            <Row gutter={24} style={{ height: '100vh' }}>
                {/* Left Panel - Solutions List */}
                <Col
                    span={isLeftPanelCollapsed ? 4 : 8}
                    className={`left-panel-col ${isLeftPanelCollapsed ? 'compact' : ''}`}
                >
                    <SolutionsList
                        solutions={solutions}
                        selectedSolution={selectedSolution}
                        remainingTime={remainingTime}
                        isLeftPanelCollapsed={isLeftPanelCollapsed}
                        onTogglePanel={handleTogglePanel}
                        onSolutionClick={handleSolutionClick}
                    />
                </Col>

                {/* Right Panel - Review Interface */}
                <Col span={isLeftPanelCollapsed ? 20 : 16} className="right-panel-col">
                    <ReviewPanel
                        selectedSolution={selectedSolution}
                        voteType={voteType}
                        testInput={testInput}
                        expectedOutput={expectedOutput}
                        notes={notes}
                        isPhaseEnded={isPhaseEnded}
                        isSubmitEnabled={isSubmitEnabled()}
                        onVoteChange={handleVoteChange}
                        onTestInputChange={(e) => setTestInput(e.target.value)}
                        onExpectedOutputChange={(e) => setExpectedOutput(e.target.value)}
                        onNotesChange={(e) => setNotes(e.target.value)}
                        onSubmit={handleSubmit}
                    />
                </Col>
            </Row>

            {/* Phase Ended Overlay */}
            {isPhaseEnded && <PhaseEndedOverlay />}
        </div>
    );
};

export default SolutionReview;
