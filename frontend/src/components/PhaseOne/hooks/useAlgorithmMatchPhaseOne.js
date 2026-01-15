import { useState, useEffect } from 'react';

const PUBLIC_TESTS = [
    { id: 1, input: '1, 5, 7, 2', expected: '15', actual: '15', status: 'passed' },
    { id: 2, input: '-1, 0, 1', expected: '0', actual: '1', status: 'failed' },
    { id: 3, input: '10, 20', expected: '30', actual: null, status: 'not-run' }
];

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main(){
    return 0;
}
`;

export const useAlgorithmMatchPhaseOne = () => {
    const [activeTab, setActiveTab] = useState('tests');
    const [language, setLanguage] = useState('C++');
    const [code, setCode] = useState(() => {
        return localStorage.getItem('phase_one_user_code') || DEFAULT_CODE;
    });
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [customTests, setCustomTests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTestInput, setNewTestInput] = useState('');
    const [newTestOutput, setNewTestOutput] = useState('');
    const [showOutput, setShowOutput] = useState(false);
    const [runResults, setRunResults] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
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

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAddTest = () => {
        const newTest = {
            id: Date.now(),
            input: newTestInput,
            expected: newTestOutput,
            actual: null,
            status: 'passed'
        };
        setCustomTests([...customTests, newTest]);
        setIsModalOpen(false);
        setNewTestInput('');
        setNewTestOutput('');
        showSuccess('Test Is Added');
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

    const handleRunPublicTests = () => {
        setShowOutput(true);
        setRunResults({
            passed: 2,
            failed: 2,
            errors: [
                "Error 1: Status 1: The separation of array [1] is not event: Failed: Input: [-1, 0, 1] Expected Output: 0, Actual Output: 1",
                "Error 2: Status 2: The separation of array [] is not event: Failed: Input: [] Expected Output: 0, Actual Output: None"
            ]
        });
    };

    return {
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        code,
        setCode,
        timeLeft,
        formatTime,
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
        PUBLIC_TESTS,
        problemTitle,
        problemDescription
    };
};
