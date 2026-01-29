import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { getStudentSolutionId, calculateSessionScores } from '../../services/solutionResultsService';
import { getStudentSolutionId } from '../../services/solutionResultsService';
import { evaluateBadges } from '../../services/badgeService';
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
    const [statusMessage, setStatusMessage] = useState('Initializing results...');

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

                //  trigger score calculation for the game session
                setStatusMessage('Calculating final scores...');
                
                try {
                    await calculateSessionScores(gameId);
                } catch (scoreErr) {
                    
                    console.warn('Score calculation warning:', scoreErr);
                }
                
                try {
                    await evaluateBadges(gameId);
                } catch (badgeErr) {
                    console.error('Badge evaluation failed', badgeErr);
                }

                // Then fetch the student's solution ID for this game
                setStatusMessage('Loading your results...');

                // TRIGGER BADGE EVALUATION
                // We fire and forget this, or await it?
                // Ideally, we want to ensure it runs, but not block the UI too long.
                // Since this page is "Game Results" (End of Game), it's the right place.
                try {
                    await evaluateBadges(gameId);
                    console.log('Badge evaluation triggered');
                } catch (badgeErr) {
                    console.error('Badge evaluation failed', badgeErr);
                    // Don't block redirect on badge error
                }

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
                <p>{statusMessage}</p>
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
