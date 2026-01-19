import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { getStudentSolutionId } from '../../services/solutionResultsService';
import './GameResults.css';

/**
 * GameResults Component
 * Handles redirecting students to their solution results after Phase 2 ends.
 * Fetches the student's solution ID for the game and redirects to solution-results page.
 */
const GameResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const gameId = searchParams.get('gameId');

    useEffect(() => {
        const fetchSolutionAndRedirect = async () => {
            if (!gameId) {
                message.error('No game ID provided');
                navigate('/home');
                return;
            }

            try {
                // Get student ID from JWT token
                const token = localStorage.getItem('token');
                if (!token) {
                    message.error('Not authenticated');
                    navigate('/login');
                    return;
                }

                const decoded = jwtDecode(token);
                const studentId = parseInt(decoded.sub, 10);

                // Fetch the student's solution ID for this game
                const data = await getStudentSolutionId(studentId, gameId);
                
                if (data.solution_id) {
                    // Redirect to solution results page
                    navigate(`/solution-results/${data.solution_id}`, { replace: true });
                } else {
                    setError('No solution found for this game session');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching solution:', err);
                setError(err.message || 'Failed to load results');
                setLoading(false);
            }
        };

        fetchSolutionAndRedirect();
    }, [gameId, navigate]);

    if (loading) {
        return (
            <div className="game-results-loading">
                <Spin size="large" />
                <p>Loading your results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game-results-error">
                <h2>Unable to Load Results</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/home')}>Return to Home</button>
            </div>
        );
    }

    return null;
};

export default GameResults;
