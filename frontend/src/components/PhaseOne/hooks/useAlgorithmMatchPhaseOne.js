import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import {
    getTests,
    postStudentTest,
    getStudentTests,
    deleteStudentTest,
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

const getUserIdFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            return parseInt(decoded.sub, 10);
        }
    } catch (e) {
        console.error('Error decoding token:', e);
    }
    return null;
};

export const useAlgorithmMatchPhaseOne = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tokenUserId = getUserIdFromToken();
    const urlGameId = searchParams.get('gameId');

    const [studentId] = useState(tokenUserId || 1);
    const [gameId] = useState(urlGameId ? parseInt(urlGameId, 10) : 3);
    const [activeTab, setActiveTab] = useState('tests');
    const [language, setLanguage] = useState('C++');
    const [code, setCode] = useState(() => {
        return localStorage.getItem('phase_one_user_code') || DEFAULT_CODE;
    });
    const [timeLeft, setTimeLeft] = useState(0); // Will be set from backend based on game session
    const [publicTests, setPublicTests] = useState([]);
    const [customTests, setCustomTests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTestInput, setNewTestInput] = useState('');
    const [newTestOutput, setNewTestOutput] = useState('');
    const [showOutput, setShowOutput] = useState(false);
    const [runResults, setRunResults] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [problemTitle, setProblemTitle] = useState("Array Sum");
    const [problemDescription, setProblemDescription] = useState("Given an array of integers, find the sum of its elements.");


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('phase_one_user_code', code);
    }, [code]);

    const loadMatchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('PhaseOne: Loading match data for gameId:', gameId, 'studentId:', studentId);

            const matchDetails = await getMatchDetails(gameId);
            console.log('PhaseOne: Match details loaded:', matchDetails);

            if (matchDetails.title) setProblemTitle(matchDetails.title);
            if (matchDetails.description) setProblemDescription(matchDetails.description);
            
            // Set the remaining time from the backend
            if (matchDetails.remaining_seconds !== undefined) {
                setTimeLeft(matchDetails.remaining_seconds);
                console.log('PhaseOne: Setting time left to:', matchDetails.remaining_seconds, 'seconds');
            }

            const testsData = await getTests(studentId, gameId);
            console.log('PhaseOne: Tests loaded:', testsData);

            const mappedPublicTests = (testsData || []).map(test => ({
                id: test.test_id,
                input: test.test_in,
                expected: test.test_out,
                actual: null,
                status: 'not-run'
            }));
            setPublicTests(mappedPublicTests);

            const customTestsData = await getStudentTests(studentId, gameId);
            console.log('PhaseOne: Custom tests loaded:', customTestsData);

            const mappedCustomTests = (customTestsData || []).map(test => ({
                id: test.test_id,
                input: test.test_in,
                expected: test.test_out,
                actual: null,
                status: 'not-run'
            }));
            setCustomTests(mappedCustomTests);

        } catch (err) {
            console.error("Error loading match data:", err);
            console.error("Error status:", err.status);
            console.error("Error details:", err);
            if (err.status === 403 || err.status === 401 || err.status === 404) {
                console.log('PhaseOne: Redirecting to /home due to error status:', err.status);
                navigate('/home');
                return;
            }
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [gameId, navigate, studentId]);

    useEffect(() => {
        // Load tests + match details when opening the page
        loadMatchData();
    }, [loadMatchData]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAddTest = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await postStudentTest(studentId, gameId, newTestInput, newTestOutput);

            const newTest = {
                id: result.test_id || Date.now(),
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
        } catch (err) {
            console.error("Error adding test:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        try {
            setIsLoading(true);
            setError(null);
            await deleteStudentTest(testId);
            setCustomTests(customTests.filter(test => test.id !== testId));
            showSuccess('Test Is Deleted');
        } catch (err) {
            console.error("Error deleting test:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const transformTestResults = (result) => {
        if (!result.compiled) {
            return {
                passed: 0,
                failed: 0,
                errors: [result.message],
                testResults: []
            };
        }

        const testResults = result.test_results || [];
        const passed = testResults.filter(t => t.status === 'pass').length;
        const failed = testResults.filter(t => t.status !== 'pass').length;
        const errors = testResults
            .filter(t => t.status !== 'pass')
            .map(t => `Test ${t.test_id}: ${t.message || 'Output mismatch'}${t.actual_output ? ` (Got: ${t.actual_output})` : ''}`);

        return { passed, failed, errors, testResults };
    };

    const updateTestsWithResults = (tests, testResults) => {
        return tests.map(test => {
            const result = testResults.find(r => r.test_id === test.id);
            if (result) {
                return {
                    ...test,
                    status: result.status === 'pass' ? 'passed' : 'failed',
                    actual: result.actual_output || null
                };
            }
            return test;
        });
    };

    const handleRunPublicTests = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await postSolution(studentId, gameId, code);

            const transformedResult = transformTestResults(result);
            setShowOutput(true);
            setRunResults(transformedResult);

            if (transformedResult.testResults.length > 0) {
                setPublicTests(updateTestsWithResults(publicTests, transformedResult.testResults));
            }
        } catch (err) {
            console.error("Error running public tests:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunCustomTests = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await postCustomTest(studentId, gameId, code);

            const transformedResult = transformTestResults(result);
            setShowOutput(true);
            setRunResults(transformedResult);

            if (transformedResult.testResults.length > 0) {
                setCustomTests(updateTestsWithResults(customTests, transformedResult.testResults));
            }
        } catch (err) {
            console.error("Error running custom tests:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // NOTE: submit is currently equivalent to running the public tests; keeping the
    // handler here makes it easy to add a dedicated "Submit" button later.
    const handleSubmitSolution = handleRunPublicTests;

    return {
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        code,
        setCode,
        timeLeft,
        formatTime,
        publicTests,
        customTests,
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
        handleRunCustomTests,
        handleSubmitSolution,
        isLoading,
        error,
        problemTitle,
        problemDescription
    };
};
