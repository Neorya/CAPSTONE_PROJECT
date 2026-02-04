import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { getSolutionTestResults, getSolutionPeerReviews } from '../../services/solutionResultsService';
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
    const [peerReviewsData, setPeerReviewsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch test results (required)
                const testResults = await getSolutionTestResults(solutionId);
                setResultsData(testResults);

                // Fetch peer reviews (optional - don't fail if unavailable)
                try {
                    const peerReviews = await getSolutionPeerReviews(solutionId);
                    setPeerReviewsData(peerReviews);
                } catch (peerReviewError) {
                    // Peer reviews not available (e.g., Phase 1, no reviews yet)
                    console.log('Peer reviews not available:', peerReviewError.message);
                    setPeerReviewsData(null);
                }
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

    // Use session_score (implementation + reviews)
    // Fallback to implementation score percentage if session_score not yet calculated
    const totalScore = resultsData.session_score !== null && resultsData.session_score !== undefined
        ? resultsData.session_score
        : null; // Will show "Not calculated" in the view if null
    const maxScore = resultsData.max_score || 100;

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
            peerReviews={peerReviewsData}
        />
    );
};

export default SolutionResultsContainer;
