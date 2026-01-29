import React from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';

const MatchDetails = ({
    formData,
    expanded,
    onToggle,
    onChange,
}) => {
    return (
        <div className="configuration-section">
            <div className="configuration-header" onClick={onToggle}>
                {expanded ? <UpOutlined /> : <DownOutlined />}
                <h3>Match Details</h3>
            </div>
            {expanded && (
                <div style={{ padding: '16px 0' }}>
                    <div className="form-group">
                        <label>Match Title <span style={{ color: '#ff4d4f' }}>*</span></label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onChange('title', e.target.value)}
                            placeholder="Min 5 characters"
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
                        <label>Description <span style={{ color: '#ff4d4f' }}>*</span></label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => onChange('description', e.target.value)}
                            placeholder="Min 10 characters"
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
                                onChange={(value) => onChange('reference_solution', value || '')}
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

export default MatchDetails;
