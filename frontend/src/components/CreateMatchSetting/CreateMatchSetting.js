import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, DownOutlined, UpOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import {
    createMatchSetting,
    updateMatchSetting,
    publishMatchSetting,
    tryMatchSetting,
    fetchMatchSetting,
} from '../../services/matchSettingsService';
import './CreateMatchSetting.css';

const CreateMatchSetting = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reference_solution: '// Reference solution for the match.\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}',
        student_code: '',
        function_name: '',
        function_type: 'output',
        function_inputs: '',
        language: 'cpp',
    });

    const [publicTests, setPublicTests] = useState([]);
    const [privateTests, setPrivateTests] = useState([]);

    const [matchDetailsExpanded, setMatchDetailsExpanded] = useState(true);
    const [configExpanded, setConfigExpanded] = useState(false);
    const [validationResults, setValidationResults] = useState(null);
    const [alert, setAlert] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTrying, setIsTrying] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [inputsList, setInputsList] = useState([]);

    // Update formData.function_inputs whenever inputsList changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            function_inputs: JSON.stringify(inputsList)
        }));
        setHasUnsavedChanges(true);
    }, [inputsList]);



    const handleAddInputRow = () => {
        setInputsList([...inputsList, { type: 'int', name: '' }]);
    };

    const handleRemoveInputRow = (index) => {
        const newList = [...inputsList];
        newList.splice(index, 1);
        setInputsList(newList);
    };

    const handleInputChangeRow = (index, field, value) => {
        const newList = [...inputsList];
        newList[index][field] = value;
        setInputsList(newList);
    };

    // Load existing match setting if in edit mode
    useEffect(() => {
        if (isEditMode) {
            fetchMatchSetting(id)
                .then((data) => {
                    setFormData({
                        title: data.title,
                        description: data.description,
                        reference_solution: data.reference_solution,
                        student_code: data.student_code || '',
                        function_name: data.function_name || '',
                        function_type: data.function_type || 'output',
                        function_inputs: data.function_inputs || '',
                        language: data.language || 'cpp',
                    });

                    // Parse function inputs if they exist
                    if (data.function_inputs) {
                        try {
                            const parsed = JSON.parse(data.function_inputs);
                            if (Array.isArray(parsed)) {
                                setInputsList(parsed);
                            }
                        } catch (e) {
                            console.error("Failed to parse function inputs", e);
                        }
                    }

                    const pubTests = data.tests.filter(t => t.scope === 'public');
                    const privTests = data.tests.filter(t => t.scope === 'private');

                    setPublicTests(pubTests);
                    setPrivateTests(privTests);
                })
                .catch((error) => {
                    setAlert({ type: 'error', message: error.message });
                });
        }
    }, [id, isEditMode]);

    // Auto-save on page exit
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges && !isEditMode) {
                handleSaveDraft();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, isEditMode]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasUnsavedChanges(true);
    };

    const handleAddPublicTest = () => {
        setPublicTests([...publicTests, { test_in: '', test_out: '' }]);
        setHasUnsavedChanges(true);
    };

    const handleAddPrivateTest = () => {
        setPrivateTests([...privateTests, { test_in: '', test_out: '' }]);
        setHasUnsavedChanges(true);
    };

    const handleTestChange = (index, field, value, isPublic) => {
        const tests = isPublic ? [...publicTests] : [...privateTests];
        tests[index][field] = value;
        isPublic ? setPublicTests(tests) : setPrivateTests(tests);
        setHasUnsavedChanges(true);
    };

    const handleDeleteTest = (index, isPublic) => {
        if (isPublic) {
            setPublicTests(publicTests.filter((_, i) => i !== index));
        } else {
            setPrivateTests(privateTests.filter((_, i) => i !== index));
        }
        setHasUnsavedChanges(true);
    };

    const handleTry = async () => {
        setIsTrying(true);
        setValidationResults(null);
        setAlert(null);

        const allTests = [
            ...publicTests.map(t => ({ ...t, scope: 'public' })),
            ...privateTests.map(t => ({ ...t, scope: 'private' })),
        ];

        try {
            const result = await tryMatchSetting({
                reference_solution: formData.reference_solution,
                language: formData.language,
                tests: allTests,
            });

            setValidationResults(result);

            if (result.success) {
                setAlert({ type: 'success', message: 'All tests passed!' });
            } else {
                setAlert({ type: 'error', message: result.message });
            }
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        } finally {
            setIsTrying(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsSubmitting(true);
        setAlert(null);

        const allTests = [
            ...publicTests.map(t => ({ ...t, scope: 'public' })),
            ...privateTests.map(t => ({ ...t, scope: 'private' })),
        ];

        const payload = {
            ...formData,
            tests: allTests,
        };

        try {
            if (isEditMode) {
                await updateMatchSetting(id, payload);
                setAlert({ type: 'success', message: 'Match setting updated as draft' });
            } else {
                const created = await createMatchSetting(payload);
                setAlert({ type: 'success', message: 'Match setting saved as draft' });
                navigate(`/match-settings/${created.match_set_id}/edit`);
            }
            setHasUnsavedChanges(false);
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePublish = async () => {
        // Validate required fields
        if (!formData.title || !formData.description || !formData.reference_solution) {
            setAlert({ type: 'error', message: 'Title, description, and reference solution are required' });
            return;
        }

        if (!formData.function_name || !formData.function_type) {
            setAlert({ type: 'error', message: 'Function name and type are required to publish' });
            return;
        }

        if (publicTests.length === 0 && privateTests.length === 0) {
            setAlert({ type: 'error', message: 'At least one test case is required' });
            return;
        }

        setIsSubmitting(true);
        setAlert(null);

        try {
            // First save/update as draft
            const allTests = [
                ...publicTests.map(t => ({ ...t, scope: 'public' })),
                ...privateTests.map(t => ({ ...t, scope: 'private' })),
            ];

            const payload = {
                ...formData,
                tests: allTests,
            };

            let matchSetId = id;

            if (isEditMode) {
                await updateMatchSetting(id, payload);
            } else {
                const created = await createMatchSetting(payload);
                matchSetId = created.match_set_id;
            }

            // Then publish
            await publishMatchSetting(matchSetId);

            setAlert({ type: 'success', message: 'Match setting published successfully!' });
            setHasUnsavedChanges(false);

            setTimeout(() => {
                navigate('/match-settings');
            }, 1500);
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateBoilerplate = () => {
        if (!formData.function_name) {
            setAlert({ type: 'error', message: 'Please enter a function name first' });
            return;
        }

        try {
            // Use inputs from state directly
            const inputs = inputsList;

            // Generate includes
            const includes = ['#include <iostream>'];
            if (inputs.some(inp => inp.type && inp.type.includes('vector'))) {
                includes.push('#include <vector>');
            }
            if (inputs.some(inp => inp.type && inp.type.includes('string'))) {
                includes.push('#include <string>');
            }

            // Generate function signature
            const returnType = formData.function_type === 'output' ? 'int' : 'void';
            const params = inputs.map(inp => `${inp.type} ${inp.name}`).join(', ');
            const functionSignature = `${returnType} ${formData.function_name}(${params})`;

            // Generate function body
            const functionBody = `${functionSignature} {
    // TODO: Implement your solution here
    ${returnType === 'int' ? 'int result = 0;\n    return result;' : ''}
}`;

            // Generate main function with I/O handling
            let mainBody = 'int main() {\n    // Automatic Input Handling\n';

            // Input reading
            inputs.forEach(inp => {
                if (inp.type === 'int' || inp.type === 'double' || inp.type === 'float') {
                    mainBody += `    ${inp.type} ${inp.name};\n`;
                    mainBody += `    std::cin >> ${inp.name};\n`;
                } else if (inp.type.includes('vector')) {
                    // Extract element type from vector<type>
                    const match = inp.type.match(/vector<(.+)>/);
                    mainBody += `    int ${inp.name}_size;\n`;
                    mainBody += `    std::cin >> ${inp.name}_size;\n`;
                    mainBody += `    ${inp.type} ${inp.name}(${inp.name}_size);\n`;
                    mainBody += `    for (int i = 0; i < ${inp.name}_size; ++i) {\n`;
                    mainBody += `        std::cin >> ${inp.name}[i];\n`;
                    mainBody += `    }\n`;
                } else if (inp.type.includes('string')) {
                    mainBody += `    ${inp.type} ${inp.name};\n`;
                    mainBody += `    std::cin >> ${inp.name};\n`;
                }
            });

            // Function call
            mainBody += '\n    // Call solve function\n';
            const argNames = inputs.map(inp => inp.name).join(', ');
            if (returnType === 'int') {
                mainBody += `    int result = ${formData.function_name}(${argNames});\n`;
                mainBody += '\n    // Automatic Output Handling\n';
                mainBody += '    std::cout << result << std::endl;\n';
            } else {
                mainBody += `    ${formData.function_name}(${argNames});\n`;
            }

            mainBody += '    return 0;\n}';

            // Combine everything
            const boilerplate = `${includes.join('\n')}\n\n// Student fills in this function\n${functionBody}\n\n${mainBody}`;

            // Set the generated code
            handleInputChange('student_code', boilerplate);
            setAlert({ type: 'success', message: 'Boilerplate code generated successfully!' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Error generating boilerplate: ' + error.message });
        }
    };

    return (
        <div className="create-match-setting-container">
            <div className="create-match-setting-card">
                {/* Header */}
                <div className="page-header">
                    <h2>{isEditMode ? 'Edit Match Setting' : 'Create Match Setting'}</h2>
                    <button
                        onClick={() => navigate('/home')}
                        className="btn btn-draft"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <ArrowLeftOutlined /> Back to Home
                    </button>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert-message ${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                {/* Match Details */}
                <div className="configuration-section">
                    <div className="configuration-header" onClick={() => setMatchDetailsExpanded(!matchDetailsExpanded)}>
                        {matchDetailsExpanded ? <UpOutlined /> : <DownOutlined />}
                        <h3>Match Details</h3>
                    </div>
                    {matchDetailsExpanded && (
                        <div style={{ padding: '16px 0' }}>
                            <div className="form-group">
                                <label>Match Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Simple Hello, World! Program"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '12px' }}>
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder='Write a program in C++ that outputs "Hello, World!".'
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <label>Reference Solution</label>
                                <div className="code-editor-wrapper" style={{ marginTop: '8px' }}>
                                    <Editor
                                        height="300px"
                                        language="cpp"
                                        value={formData.reference_solution}
                                        onChange={(value) => handleInputChange('reference_solution', value || '')}
                                        theme="vs-dark"
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Test Cases */}
                <div className="test-cases-container">
                    {/* Public Tests */}
                    <div className="test-case-section">
                        <h3>Public Test Cases</h3>
                        <table className="test-table">
                            <thead>
                                <tr>
                                    <th>Input</th>
                                    <th>Output</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {publicTests.map((test, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={test.test_in || ''}
                                                onChange={(e) => handleTestChange(index, 'test_in', e.target.value, true)}
                                                placeholder="None"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={test.test_out}
                                                onChange={(e) => handleTestChange(index, 'test_out', e.target.value, true)}
                                                placeholder="Hello, World!"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="delete-test-btn"
                                                onClick={() => handleDeleteTest(index, true)}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="add-test-btn" onClick={handleAddPublicTest}>
                            <PlusOutlined /> Add Public Row
                        </button>
                    </div>

                    {/* Private Tests */}
                    <div className="test-case-section">
                        <h3>Private Test Cases</h3>
                        <table className="test-table">
                            <thead>
                                <tr>
                                    <th>Input</th>
                                    <th>Output</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {privateTests.map((test, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={test.test_in || ''}
                                                onChange={(e) => handleTestChange(index, 'test_in', e.target.value, false)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={test.test_out}
                                                onChange={(e) => handleTestChange(index, 'test_out', e.target.value, false)}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="delete-test-btn"
                                                onClick={() => handleDeleteTest(index, false)}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="add-test-btn" onClick={handleAddPrivateTest}>
                            <PlusOutlined /> Add Private Row
                        </button>
                    </div>
                </div>

                {/* Professor Configuration */}
                <div className="configuration-section">
                    <div className="configuration-header" onClick={() => setConfigExpanded(!configExpanded)}>
                        {configExpanded ? <UpOutlined /> : <DownOutlined />}
                        <h3>Professor Configuration <span className="optional-badge">(Optional)</span></h3>
                    </div>
                    {configExpanded && (
                        <div className="configuration-content">
                            <div className="form-group">
                                <label>Function Name</label>
                                <input
                                    type="text"
                                    value={formData.function_name}
                                    onChange={(e) => handleInputChange('function_name', e.target.value)}
                                    placeholder="solve"
                                />
                            </div>
                            <div className="form-group">
                                <label>Function Type</label>
                                <input
                                    type="text"
                                    value={formData.function_type}
                                    onChange={(e) => handleInputChange('function_type', e.target.value)}
                                    placeholder="output"
                                    disabled
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ marginBottom: '8px', display: 'block' }}>Function Inputs</label>
                                {inputsList.map((input, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <select
                                            value={input.type}
                                            onChange={(e) => handleInputChangeRow(idx, 'type', e.target.value)}
                                            style={{ flex: 1, padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                                        >
                                            <option value="int">int</option>
                                            <option value="float">float</option>
                                            <option value="double">double</option>
                                            <option value="string">string</option>
                                            <option value="std::string">std::string</option>
                                            <option value="std::vector<int>">std::vector&lt;int&gt;</option>
                                            <option value="std::vector<string>">std::vector&lt;string&gt;</option>
                                            <option value="std::vector<double>">std::vector&lt;double&gt;</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={input.name}
                                            onChange={(e) => handleInputChangeRow(idx, 'name', e.target.value)}
                                            placeholder="Variable Name"
                                            style={{ flex: 1, padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInputRow(idx)}
                                            style={{
                                                background: '#ff4d4f',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                padding: '0 12px'
                                            }}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddInputRow}
                                    style={{
                                        marginTop: '4px',
                                        background: 'transparent',
                                        border: '1px dashed #d9d9d9',
                                        width: '100%',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        color: '#666'
                                    }}
                                >
                                    <PlusOutlined /> Add Input
                                </button>
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={generateBoilerplate}
                                    className="btn btn-publish"
                                    style={{ width: '100%' }}
                                    disabled={!formData.function_name}
                                >
                                    Generate Boilerplate
                                </button>
                                <small style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                                    This will generate student template code with automatic I/O handling based on your function configuration
                                </small>
                            </div>

                            {/* Code Preview */}
                            <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '24px' }}>
                                <label style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                                    Code Preview
                                </label>
                                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                                    This code will be provided to students as a starting template. You can edit it manually or generate it using the button above.
                                </p>
                                <div className="code-editor-wrapper">
                                    <Editor
                                        height="350px"
                                        language="cpp"
                                        value={formData.student_code}
                                        onChange={(value) => handleInputChange('student_code', value || '')}
                                        theme="vs-dark"
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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

export default CreateMatchSetting;
