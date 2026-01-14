import React, { useState, useEffect } from 'react';

import {
  getTests,
  postStudentTest,
  getStudentTests,
  postSolution,
  postCustomTest,
  getMatchDetails
} from '../../../services/phaseOneService';

const DEFAULT_CODE = `#include <iostream>
using namespace std;
int main(){
    return 0;
}
`;

export const useAlgorithmMatchPhaseOne = () => {
    const [studentId, setStudentId] = useState(1);
    const [gameId, setGameId] = useState(1);
    const [activeTab, setActiveTab] = useState('tests');
    const [language, setLanguage] = useState('C++');
    const [code, setCode] = useState(DEFAULT_CODE);
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [customTests, setCustomTests] = useState([]);
    const [publicTests, setPublicTests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTestInput, setNewTestInput] = useState('');
    const [newTestOutput, setNewTestOutput] = useState('');
    const [showOutput, setShowOutput] = useState(false);
    const [runResults, setRunResults] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [problemTitle, setProblemTitle] = useState("Array Sum");
    const [problemDescription, setProblemDescription] = useState("Given an array of integers, find the sum of its elements.");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (gameId && studentId) {
            loadMatchData();
        }
    }, [gameId, studentId]);


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const loadMatchData = async () => {
        try {
            setLoading(true);
            
            const matchDetails = await getMatchDetails(gameId);
            if (matchDetails.title) setProblemTitle(matchDetails.title);
            if (matchDetails.description) setProblemDescription(matchDetails.description);
            
            const testsData = await getTests(studentId, gameId);
            setPublicTests(testsData || []);
            
            const customTestsData = await getStudentTests(studentId, gameId);
            setCustomTests(customTestsData || []);
            
            setLoading(false);
        } catch (err) {
            console.error("Error loading match data:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAddTest = async () => {
        try {
            setLoading(true);
            const result = await postStudentTest(studentId, gameId, newTestInput, newTestOutput);
            
            const newTest = {
                id: result.id || Date.now(),
                input: newTestInput,
                expected: newTestOutput,
                actual: null,
                status: 'not-run'
            };
            
            setCustomTests([...customTests, newTest]);
            setIsModalOpen(false);
            setNewTestInput('');
            setNewTestOutput('');
            showSuccess('Test Is Added');
            setLoading(false);
        } catch (err) {
            console.error("Error adding test:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDeleteTest = (index) => {
        const updatedTests = [...customTests];
        updatedTests.splice(index, 1);
        setCustomTests(updatedTests);
        showSuccess('Test Is Deleted');
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleRunPublicTests = async () => {
        try {
            setLoading(true);
            const result = await postCustomTest(studentId, gameId, code);
            
            setShowOutput(true);
            setRunResults(result);
            setLoading(false);
        } catch (err) {
            console.error("Error running tests:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmitSolution = async () => {
        try {
            setLoading(true);
            const result = await postSolution(studentId, gameId, code);
            showSuccess('Solution submitted successfully!');
            setLoading(false);
            return result;
        } catch (err) {
            console.error("Error submitting solution:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    return {
        studentId,
        setStudentId,
        gameId,
        setGameId,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        code,
        setCode,
        timeLeft,
        formatTime,
        customTests,
        publicTests,
        isModalOpen,
        setIsModalOpen,
        newTestInput,
        setNewTestInput,
        newTestOutput,
        setNewTestOutput,
        showOutput,
        setShowOutput,
        runResults,
        successMessage,
        handleAddTest,
        handleDeleteTest,
        handleRunPublicTests,
        handleSubmitSolution,
        problemTitle,
        problemDescription,
        loading,
        error,
        loadMatchData
    };
};