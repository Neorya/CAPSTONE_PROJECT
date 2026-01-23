import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import SolutionCodeBlock from './components/SolutionCodeBlock';
import ScoreDisplay from './components/ScoreDisplay';
import TestResultsSection from './components/TestResultsSection';

/**
 * SolutionResultsView Component
 * Presentational component for displaying solution results
 */
const SolutionResultsView = ({
    studentName,
    challengeTitle,
    code,
    totalScore,
    maxScore,
    publicTeacherTests,
    privateTeacherTests,
    studentTests,
}) => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div className="solution-results-container" id="solution-results-container">
            {/* Header */}
            <div className="solution-results-header" id="solution-results-header">

                <h1 className='page-title-solution'>
                    Solution Review - Game Session:  {challengeTitle}
                </h1>

            </div>

            {/* Main Content - Two Column Layout */}
            <div className="solution-results-content">
                {/* Left Panel - Code Block */}
                <div className="left-panel">
                    <SolutionCodeBlock code={code} language="cpp" />
                </div>

                {/* Right Panel - Score and Test Results */}
                <div className="right-panel">
                    <ScoreDisplay
                        score={totalScore}
                        maxScore={maxScore}
                        publicTestsPassed={publicTeacherTests.filter(t => t.status === 'Passed').length}
                        publicTestsTotal={publicTeacherTests.length}
                        privateTestsPassed={privateTeacherTests.filter(t => t.status === 'Passed').length}
                        privateTestsTotal={privateTeacherTests.length}
                        studentTestsPassed={studentTests.filter(t => t.status === 'Passed').length}
                        studentTestsTotal={studentTests.length}
                    />

                    {/* Public Teacher Tests */}
                    {publicTeacherTests.length > 0 && (
                        <TestResultsSection
                            title="PUBLIC TEACHER TESTS"
                            testResults={publicTeacherTests}
                            sectionId="public-teacher-tests"
                        />
                    )}

                    {/* Private Teacher Tests */}
                    {privateTeacherTests.length > 0 && (
                        <TestResultsSection
                            title="PRIVATE TEACHER TESTS"
                            testResults={privateTeacherTests}
                            sectionId="private-teacher-tests"
                        />
                    )}

                    {/* Student Provided Tests */}
                    {studentTests.length > 0 && (
                        <TestResultsSection
                            title="STUDENT PROVIDED TESTS"
                            testResults={studentTests}
                            sectionId="student-provided-tests"
                        />
                    )}

                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Button
                    type="primary"
                    size="large"
                    icon={<HomeOutlined />}
                    onClick={handleReturnHome}
                    id="return-home-button"
                    style={{ height: '50px', marginTop: '40px' }}
                >
                    Return to Home
                </Button>
            </div>
        </div>
    );
};

SolutionResultsView.propTypes = {
    studentName: PropTypes.string.isRequired,
    challengeTitle: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    totalScore: PropTypes.number.isRequired,
    maxScore: PropTypes.number.isRequired,
    publicTeacherTests: PropTypes.array.isRequired,
    privateTeacherTests: PropTypes.array.isRequired,
    studentTests: PropTypes.array.isRequired,
};

export default SolutionResultsView;
