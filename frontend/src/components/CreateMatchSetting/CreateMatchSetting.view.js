import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import MatchDetails from './components/MatchDetails';
import TestCases from './components/TestCases';
import ProfessorConfig from './components/ProfessorConfig';
import './CreateMatchSetting.css';

const CreateMatchSettingView = ({
    isEditMode,
    formData,
    publicTests,
    privateTests,
    matchDetailsExpanded,
    configExpanded,
    validationResults,
    alert,
    isSubmitting,
    isTrying,
    inputsList,
    handlers,
}) => {
    const {
        setMatchDetailsExpanded,
        setConfigExpanded,
        handleInputChange,
        handleTestChange,
        handleDeleteTest,
        handleAddPublicTest,
        handleAddPrivateTest,
        handleInputChangeRow,
        handleRemoveInputRow,
        handleAddInputRow,
        generateBoilerplate,
        handleTry,
        handlePublish,
        handleSaveDraft,
        onBack,
    } = handlers;

    return (
        <div className="create-match-setting-container">
            <div className="create-match-setting-card">
                {/* Header */}
                <div className="page-header">
                    <h2>{isEditMode ? 'Edit Match Setting' : 'Create Match Setting'}</h2>
                    <Tooltip title="Back to Home">
                        <Button
                            id="back-to-home-button"
                            icon={<ArrowLeftOutlined />}
                            onClick={onBack}
                            shape="circle"
                            size="large"
                        />
                    </Tooltip>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert-message ${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                {/* Match Details */}
                <MatchDetails
                    formData={formData}
                    expanded={matchDetailsExpanded}
                    onToggle={() => setMatchDetailsExpanded(!matchDetailsExpanded)}
                    onChange={handleInputChange}
                />

                {/* Test Cases */}
                <TestCases
                    publicTests={publicTests}
                    privateTests={privateTests}
                    onChange={handleTestChange}
                    onDelete={handleDeleteTest}
                    onAddPublic={handleAddPublicTest}
                    onAddPrivate={handleAddPrivateTest}
                />

                {/* Professor Configuration */}
                <ProfessorConfig
                    formData={formData}
                    inputsList={inputsList}
                    expanded={configExpanded}
                    onToggle={() => setConfigExpanded(!configExpanded)}
                    onChange={handleInputChange}
                    onInputChangeRow={handleInputChangeRow}
                    onRemoveInputRow={handleRemoveInputRow}
                    onAddInputRow={handleAddInputRow}
                    onGenerateBoilerplate={generateBoilerplate}
                />

                {/* Validation Results */}
                {validationResults && (
                    <div className={`validation-results ${validationResults.success ? '' : 'error'}`}>
                        <h4>{validationResults.message}</h4>
                        {validationResults.compilation_error && (
                            <pre style={{ fontSize: '12px', color: '#ff4d4f' }}>
                                {validationResults.compilation_error}
                            </pre>
                        )}
                        {validationResults.test_results && validationResults.test_results.map((result, index) => (
                            <div key={index} className={`test-result-item ${result.passed ? 'passed' : 'failed'}`}>
                                <strong>Test {index + 1}:</strong> {result.passed ? '✓ Passed' : '✗ Failed'}
                                <br />
                                <small>Input: {result.test_in || 'None'} | Expected: {result.test_out} | Got: {result.actual_output}</small>
                                {result.error && <div style={{ color: '#ff4d4f', fontSize: '12px' }}>{result.error}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="btn btn-try"
                        onClick={handleTry}
                        disabled={isTrying || isSubmitting}
                    >
                        {isTrying ? 'Running...' : 'Try'}
                    </button>
                    <button
                        className="btn btn-publish"
                        onClick={handlePublish}
                        disabled={isSubmitting || isTrying}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish'}
                    </button>
                    <button
                        className="btn btn-draft"
                        onClick={handleSaveDraft}
                        disabled={isSubmitting || isTrying}
                    >
                        {isSubmitting ? 'Saving...' : 'Save as Draft'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateMatchSettingView;
