import React from 'react';
import PropTypes from 'prop-types';

/**
 * ScoreDisplay Component
 * Displays the total score and test summary in a vertical card layout
 */
const ScoreDisplay = ({
    score,
    maxScore,
    publicTestsPassed,
    publicTestsTotal,
    privateTestsPassed,
    privateTestsTotal,
    studentTestsPassed,
    studentTestsTotal
}) => {
    const hasStudentTests = studentTestsTotal > 0;

    return (
        <div className="score-display-card" id="score-display">
            {/* Top section - Total Score */}
            <div className="score-section">
                <div className="score-label">TOTAL SCORE</div>
                <div className="score-value" id="total-score-value">
                    {score !== null && score !== undefined ? score : 'N/A'}
                    <span className="score-separator">/</span>{maxScore}
                </div>
            </div>

            {/* Horizontal divider */}
            <div className="score-horizontal-divider"></div>

            {/* Bottom section - Test Summary */}
            <div className="test-summary-section">
                <div className="test-summary-label">TEST RESULTS SUMMARY</div>
                <div className="test-summary-grid">
                    <div className="test-summary-item">
                        <span className="test-summary-icon public">📘</span>
                        <div className="test-summary-content">
                            <div className="test-summary-title">Public Tests</div>
                            <div className="test-summary-value">{publicTestsPassed}/{publicTestsTotal}</div>
                        </div>
                    </div>

                    <div className="test-summary-item">
                        <span className="test-summary-icon private">🔒</span>
                        <div className="test-summary-content">
                            <div className="test-summary-title">Private Tests</div>
                            <div className="test-summary-value">{privateTestsPassed}/{privateTestsTotal}</div>
                        </div>
                    </div>

                    {hasStudentTests && (
                        <div className="test-summary-item">
                            <span className="test-summary-icon student">👥</span>
                            <div className="test-summary-content">
                                <div className="test-summary-title">Student Tests</div>
                                <div className="test-summary-value">{studentTestsPassed}/{studentTestsTotal}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ScoreDisplay.propTypes = {
    score: PropTypes.number,
    maxScore: PropTypes.number.isRequired,
    publicTestsPassed: PropTypes.number.isRequired,
    publicTestsTotal: PropTypes.number.isRequired,
    privateTestsPassed: PropTypes.number.isRequired,
    privateTestsTotal: PropTypes.number.isRequired,
    studentTestsPassed: PropTypes.number.isRequired,
    studentTestsTotal: PropTypes.number.isRequired,
};

export default ScoreDisplay;
