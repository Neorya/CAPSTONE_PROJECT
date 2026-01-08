import React from 'react';
import {
    Card,
    Tabs,
    Typography,
    Flex
} from 'antd';
import {
    CheckCircleFilled,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useAlgorithmMatchPhaseOne } from './hooks/useAlgorithmMatchPhaseOne';
import ProblemDescription from './components/ProblemDescription';
import TestCasesList from './components/TestCasesList';
import EditorPanel from './components/EditorPanel';
import AddTestModal from './components/AddTestModal';
import './AlgorithmMatchPhaseOne.css';

const AlgorithmMatchPhaseOne = () => {
    const {
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
    } = useAlgorithmMatchPhaseOne();

    const tabItems = [
        {
            key: 'problem',
            label: 'Problem Description',
            children: <ProblemDescription title={problemTitle} description={problemDescription} />
        },
        {
            key: 'tests',
            label: 'Tests (Public & Mine)',
            children: (
                <TestCasesList
                    publicTests={PUBLIC_TESTS}
                    customTests={customTests}
                    onAddTestClick={() => setIsModalOpen(true)}
                    onDeleteTest={handleDeleteTest}
                />
            )
        }
    ];

    return (
        <div className="algorithm-match-container">
            {successMessage && (
                <div className="success-message">
                    <CheckCircleFilled className="success-icon" /> {successMessage}
                </div>
            )}

            <Card className="create-match-card">
                <Flex justify="space-between" align="center" className="header-container">
                    <div className="page-title">
                        <Typography.Title level={2} className="page-title-text">Algorithm Match - Phase 1</Typography.Title>
                    </div>
                    <div className="timer">
                        <Typography.Text strong className="timer-text">
                            <ClockCircleOutlined /> Time Remaining: {formatTime(timeLeft)}
                        </Typography.Text>
                    </div>
                </Flex>

                <Flex gap="large" className="main-content-layout">
                    {/* Left Panel */}
                    <Card className="panel-card left-panel-card">
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={tabItems}
                            className="tabs-container"
                        />
                    </Card>

                    {/* Right Panel */}
                    <Card className="panel-card right-panel-card">
                        <EditorPanel
                            language={language}
                            setLanguage={setLanguage}
                            code={code}
                            setCode={setCode}
                            timeLeft={timeLeft}
                            handleRunPublicTests={handleRunPublicTests}
                            publicTestsCount={PUBLIC_TESTS.length}
                            showOutput={showOutput}
                            setShowOutput={setShowOutput}
                            runResults={runResults}
                        />
                    </Card>
                </Flex>
            </Card>

            {/* Add Test Modal */}
            <AddTestModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onAdd={handleAddTest}
                input={newTestInput}
                setInput={setNewTestInput}
                output={newTestOutput}
                setOutput={setNewTestOutput}
            />
        </div>
    );
};

export default AlgorithmMatchPhaseOne;
