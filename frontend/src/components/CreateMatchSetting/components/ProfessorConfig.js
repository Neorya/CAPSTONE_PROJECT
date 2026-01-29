import React from 'react';
import { UpOutlined, DownOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';

const ProfessorConfig = ({
    formData,
    inputsList,
    expanded,
    onToggle,
    onChange,
    onInputChangeRow,
    onRemoveInputRow,
    onAddInputRow,
    onGenerateBoilerplate,
}) => {
    return (
        <div className="configuration-section">
            <div className="configuration-header" onClick={onToggle}>
                {expanded ? <UpOutlined /> : <DownOutlined />}
                <h3>Professor Configuration <span className="optional-badge">(Optional)</span></h3>
            </div>
            {expanded && (
                <div className="configuration-content" style={{ marginTop: '16px' }}>
                    <div className="form-group">
                        <label>Function Name</label>
                        <input
                            type="text"
                            value={formData.function_name}
                            onChange={(e) => onChange('function_name', e.target.value)}
                            placeholder="solve"
                        />
                    </div>
                    <div className="form-group">
                        <label>Function Type</label>
                        <select
                            value={formData.function_type}
                            onChange={(e) => onChange('function_type', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                        >
                            <option value="int">int</option>
                            <option value="float">float</option>
                            <option value="double">double</option>
                            <option value="string">string</option>
                            <option value="std::string">std::string</option>
                            <option value="void">void</option>
                            <option value="std::vector<int>">std::vector&lt;int&gt;</option>
                            <option value="std::vector<string>">std::vector&lt;string&gt;</option>
                            <option value="std::vector<double>">std::vector&lt;double&gt;</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ marginBottom: '8px', display: 'block' }}>Function Inputs</label>
                        {inputsList.map((input, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <select
                                    value={input.type}
                                    onChange={(e) => onInputChangeRow(idx, 'type', e.target.value)}
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
                                    onChange={(e) => onInputChangeRow(idx, 'name', e.target.value)}
                                    placeholder="Variable Name"
                                    style={{ flex: 1, padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveInputRow(idx)}
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
                            onClick={onAddInputRow}
                            className="add-input-btn"
                        >
                            <PlusOutlined /> Add Input
                        </button>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                        <button
                            type="button"
                            onClick={onGenerateBoilerplate}
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
                                onChange={(value) => onChange('student_code', value || '')}
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
    );
};

export default ProfessorConfig;
