import { useState, useEffect, useCallback } from 'react';
import { getAssignSolution, postStudentVote } from '../../../services/phaseTwoService';
const MOCK_SOLUTIONS = [
    {
        id: 'sol-1',
        participantId: 'User 2',
        code: "#include <iostream>" }];

export const useSolutionReview = () => {
    const [solutions, setSolutions] = useState([]);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [votes, setVotes] = useState({});
    const [remainingTime, setRemainingTime] = useState('45:00');
    const [isPhaseEnded, setIsPhaseEnded] = useState(false);

    // Timer countdown
    useEffect(() => {
        // Mock: Phase 2 ends in 45 minutes from now
        const endTime = Date.now() + (45 * 60 * 1000);
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, endTime - now);

            if (diff === 0) {
                setIsPhaseEnded(true);
                clearInterval(interval);
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setRemainingTime(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const loadSolutions = useCallback(async () => {
        try {
            // Assicurati che getAssignSolution(1) non fallisca silenziosamente
            const fetchedSolutions = await getAssignSolution(1);
            console.log(fetchedSolutions);
            let mapSolutions = (fetchedSolutions || []).map(sol => ({
                id: sol.assigned_solution_id,
                code: sol.code,
                participantId: sol.pseudonym
            }));
            setSolutions(mapSolutions);
            // Probabilmente vorrai fare setSolutions(fetchedSolutions) qui
        } catch(err) {
            console.error("Errore nel caricamento:", err);
        }
    }, []); // Dipendenze vuote: la funzione è stabile

    useEffect(() => {
        loadSolutions();
    }, [loadSolutions]); 

    const selectSolution = (solutionId) => {
        const solution = solutions.find(s => s.id === solutionId);
        setSelectedSolution(solution);
    };

    const submitVote = async (solutionId, voteType, testCase = null, note = "") => {
        const solution = solutions.find(s => s.id === solutionId);
        await postStudentVote(solution.id, voteType.type, testCase.input, testCase.expectedOutput, note);



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
        selectSolution,
        submitVote,
        getVoteStatus
    };
};
