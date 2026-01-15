import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getSolutionTestResults } from '../../services/solutionResultsService';
import SolutionResultsView from './SolutionResultsView';
import './SolutionResults.css';

/**
 * SolutionResultsContainer Component
 * Container component handling data fetching and state management
 */
const SolutionResultsContainer = () => {
    const { solutionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [resultsData, setResultsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getSolutionTestResults(solutionId);
                setResultsData(data);
            } catch (err) {
                setError(err.message);
                message.error(`Failed to load solution results: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (solutionId) {
            fetchResults();
        }
    }, [solutionId]);

    // Group test results by type and scope
    const groupTestResults = (testResults) => {
        const publicTeacher = [];
        const privateTeacher = [];
        const student = [];

        testResults.forEach((test) => {
            if (test.provider === 'teacher') {
                if (test.scope === 'public') {
                    publicTeacher.push(test);
                } else if (test.scope === 'private') {
                    privateTeacher.push(test);
                }
            } else if (test.provider === 'student') {
                student.push(test);
            }
        });

        return { publicTeacher, privateTeacher, student };
    };

    if (loading) {
        return (
            <div className="solution-results-loading">
                <div className="loading-spinner"></div>
                <p>Loading solution results...</p>
            </div>
        );
    }

    if (error || !resultsData) {
        return (
            <div className="solution-results-error">
                <h2>Error Loading Results</h2>
                <p>{error || 'No data available'}</p>
            </div>
        );
    }

    const { publicTeacher, privateTeacher, student } = groupTestResults(
        resultsData.test_results || []
    );

    // Calculate total score based on implementation score percentage
    const totalScore = Math.round(resultsData.implementation_score_percentage || 0);
    const maxScore = 100;

    return (
        <SolutionResultsView
            studentName={resultsData.student_name}
            challengeTitle={resultsData.match_title}
            code={resultsData.code}
            totalScore={totalScore}
            maxScore={maxScore}
            publicTeacherTests={publicTeacher}
            privateTeacherTests={privateTeacher}
            studentTests={student}
        />
    );
};

export default SolutionResultsContainer;
