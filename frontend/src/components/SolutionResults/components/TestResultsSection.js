import React from 'react';
import PropTypes from 'prop-types';
import TestResultItem from './TestResultItem';

/**
 * TestResultsSection Component
 * Groups test results by type with a header showing pass count
 */
const TestResultsSection = ({ title, testResults, sectionId }) => {
    const passedCount = testResults.filter(test => test.status === 'Passed').length;
    const totalCount = testResults.length;

    return (
        <div className="test-results-section" id={sectionId}>
            <h3 className="section-header">
                {title} ({passedCount}/{totalCount} Passed)
            </h3>
            <div className="test-results-list">
                {testResults.map((test, index) => (
                    <TestResultItem
                        key={test.test_id || index}
                        testNumber={index + 1}
                        input={test.test_input || 'N/A'}
                        expectedOutput={test.expected_output || 'N/A'}
                        actualOutput={test.actual_output}
                        status={test.status}
                    />
                ))}
            </div>
        </div>
    );
};

TestResultsSection.propTypes = {
    title: PropTypes.string.isRequired,
    testResults: PropTypes.arrayOf(
        PropTypes.shape({
            test_id: PropTypes.number,
            test_input: PropTypes.string,
            expected_output: PropTypes.string,
            actual_output: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
    sectionId: PropTypes.string.isRequired,
};

export default TestResultsSection;
