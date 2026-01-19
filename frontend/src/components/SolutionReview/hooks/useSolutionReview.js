import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAssignSolution, postStudentVote, getPhaseTwoTiming } from '../../../services/phaseTwoService';

export const useSolutionReview = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const gameId = searchParams.get('gameId');

    const [solutions, setSolutions] = useState([]);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [votes, setVotes] = useState({});
    const [remainingTime, setRemainingTime] = useState(null);
    const [isPhaseEnded, setIsPhaseEnded] = useState(false);
    const [timerInitialized, setTimerInitialized] = useState(false);

    // Fetch timing from backend and set up countdown
    useEffect(() => {
        if (!gameId) return;

        let interval = null;

        const initTimer = async () => {
            try {
                const timing = await getPhaseTwoTiming(gameId);
                let remainingSeconds = timing.remaining_seconds;
                
                setTimerInitialized(true);

                const updateTimer = () => {
                    if (remainingSeconds <= 0) {
                        setRemainingTime('00:00');
                        setIsPhaseEnded(true);
                        if (interval) clearInterval(interval);
                        // Redirect to results page after phase 2 ends
                        setTimeout(() => {
                            navigate(`/game-results?gameId=${gameId}`);
                        }, 2000);
                        return;
                    }

                    const minutes = Math.floor(remainingSeconds / 60);
                    const seconds = remainingSeconds % 60;
                    setRemainingTime(
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                    );
                    remainingSeconds--;
                };

                updateTimer();
                interval = setInterval(updateTimer, 1000);
            } catch (err) {
                console.error("Error fetching phase 2 timing:", err);
                // Fallback to default timer if backend fails
                setRemainingTime('45:00');
                setTimerInitialized(true);
            }
        };

        initTimer();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameId, navigate]);

    const loadSolutions = useCallback(async () => {
        if (!gameId) return;
        try {
            const fetchedSolutions = await getAssignSolution(gameId);
            console.log(fetchedSolutions);
            let mapSolutions = (fetchedSolutions || []).map(sol => ({
                id: sol.student_assigned_review_id,
                code: sol.code,
                participantId: sol.pseudonym
            }));
            setSolutions(mapSolutions);
        } catch(err) {
            console.error("Error loading solutions:", err);
        }
    }, [gameId]);

    useEffect(() => {
        loadSolutions();
    }, [loadSolutions]); 

    const selectSolution = (solutionId) => {
        const solution = solutions.find(s => s.id === solutionId);
        setSelectedSolution(solution);
    };

    const submitVote = async (solutionId, voteType, testCase = null, note = "") => {
        const solution = solutions.find(s => s.id === solutionId);
        if (testCase === null ) testCase = { input: "", expectedOutput: ""};
        await postStudentVote(solution.id, voteType, testCase.input, testCase.expectedOutput, note);

        // Update votes map
        setVotes(prev => ({
            ...prev,
            [solutionId]: { type: voteType, testCase }
        }));
        // Remove from solutions list (can't re-review)
        setSolutions(prev => prev.filter(s => s.id !== solutionId));

        // Clear selection
        setSelectedSolution(null);

        return true;
    };

    const getVoteStatus = (solutionId) => {
        return votes[solutionId]?.type || null;
    };

    return {
        solutions,
        selectedSolution,
        votes,
        remainingTime,
        isPhaseEnded,
        timerInitialized,
        selectSolution,
        submitVote,
        getVoteStatus
    };
};
