import React from 'react';
import PropTypes from 'prop-types';

/**
 * TestResultItem Component
 * Displays a single test result with input, output, and status
 */
const TestResultItem = ({ testNumber, input, expectedOutput, actualOutput, status }) => {
    const isPassed = status === 'Passed';
    const statusIcon = isPassed ? '✓' : '✗';
    const statusClass = isPassed ? 'passed' : 'failed';

    return (
        <div className={`test-result-item ${statusClass}`} data-testid={`test-result-${testNumber}`}>
            <div className="test-header">
                <span className="test-number">{testNumber}.</span>
                <span className="test-input">
                    Input {input}
                </span>
                <span className="test-arrow">-&gt;</span>
                <span className="test-expected">
                    Exp {expectedOutput}
                </span>
                <span className={`test-status-icon ${statusClass}`} data-testid={`test-status-${testNumber}`}>
                    {statusIcon}
                </span>
                <span className={`test-status-text ${statusClass}`}>
                    {status}
                </span>
            </div>
            {!isPassed && (
                <div className="test-failure-details">
                    <span className="failure-label">Failed</span>
                    <span className="failure-output">(Output: {actualOutput})</span>
                </div>
            )}
        </div>
    );
};

TestResultItem.propTypes = {
    testNumber: PropTypes.number.isRequired,
    input: PropTypes.string.isRequired,
    expectedOutput: PropTypes.string.isRequired,
    actualOutput: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['Passed', 'Failed']).isRequired,
};

export default TestResultItem;
