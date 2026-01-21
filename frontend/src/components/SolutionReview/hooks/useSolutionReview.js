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
    const [phaseTwoEndTime, setPhaseTwoEndTime] = useState(null); // Target end time in milliseconds

    // Fetch timing from backend and set up countdown
    useEffect(() => {
        if (!gameId) return;

        const initTimer = async () => {
            try {
                const timing = await getPhaseTwoTiming(gameId);

                // Calculate the target end time from phase2_start_time and duration_phase2
                if (timing.phase2_start_time && timing.duration_phase2 !== undefined) {
                    const startTime = new Date(timing.phase2_start_time).getTime();
                    const durationMs = timing.duration_phase2 * 60 * 1000; // Convert minutes to milliseconds
                    const endTime = startTime + durationMs;

                    setPhaseTwoEndTime(endTime);
                    setTimerInitialized(true);
                    console.log('PhaseTwo: Phase will end at:', new Date(endTime).toISOString());
                }
            } catch (err) {
                console.error("Error fetching phase 2 timing:", err);
                // Fallback to default timer if backend fails
                setRemainingTime('45:00');
                setTimerInitialized(true);
            }
        };

        initTimer();
    }, [gameId]);

    // Update timer every second based on target end time
    useEffect(() => {
        if (phaseTwoEndTime === null) return;

        const updateTimer = () => {
            const now = Date.now();
            const remainingMs = Math.max(0, phaseTwoEndTime - now);
            const remainingSeconds = Math.floor(remainingMs / 1000);

            if (remainingSeconds <= 0) {
                setRemainingTime('00:00');
                setIsPhaseEnded(true);
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
        };

        // Update immediately
        updateTimer();

        // Then update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [phaseTwoEndTime, gameId, navigate]);

    const loadSolutions = useCallback(async () => {
        if (!gameId) return;
        try {
            const fetchedSolutions = await getAssignSolution(gameId);
            console.log(fetchedSolutions);
            let mapSolutions = (fetchedSolutions || []).map(sol => ({
                id: sol.student_assigned_review_id,
                code: sol.code,
                participantId: sol.pseudonym,
                hasVoted: false,
                votedType: null
            }));
            setSolutions(mapSolutions);
        } catch (err) {
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
        if (testCase === null) testCase = { input: "", expectedOutput: "" };
        await postStudentVote(solution.id, voteType, testCase.input, testCase.expectedOutput, note);

        // record the vote
        setVotes(prev => ({
            ...prev,
            [solutionId]: { type: voteType, testCase, note }
        }));
        
        // keep it in the list; just mark it voted
        setSolutions(prev =>
            prev.map(s =>
                s.id === solutionId
                    ? { ...s, hasVoted: true, votedType: voteType }
                    : s
            )
        );
        
        // keep or clear selection (either is fine). clearing is ok:
        setSelectedSolution(null);
        
        return true;
        
    };

    const getVoteStatus = (solutionId) => {
        return votes[solutionId] || null;
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
