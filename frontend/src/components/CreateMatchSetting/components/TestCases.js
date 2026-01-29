import React from 'react';
import { PlusOutlined } from '@ant-design/icons';

const TestCases = ({
    publicTests,
    privateTests,
    onChange,
    onDelete,
    onAddPublic,
    onAddPrivate,
}) => {
    return (
        <div className="test-cases-container">
            {/* Public Tests */}
            <div className="test-case-section">
                <h3>Public Test Cases <span style={{ color: '#ff4d4f' }}>*</span></h3>
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
                                        onChange={(e) => onChange(index, 'test_in', e.target.value, true)}
                                        placeholder="None"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={test.test_out}
                                        onChange={(e) => onChange(index, 'test_out', e.target.value, true)}
                                        placeholder="Hello, World!"
                                    />
                                </td>
                                <td>
                                    <button
                                        className="delete-test-btn"
                                        onClick={() => onDelete(index, true)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="add-test-btn" onClick={onAddPublic}>
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
                                        onChange={(e) => onChange(index, 'test_in', e.target.value, false)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={test.test_out}
                                        onChange={(e) => onChange(index, 'test_out', e.target.value, false)}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="delete-test-btn"
                                        onClick={() => onDelete(index, false)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="add-test-btn" onClick={onAddPrivate}>
                    <PlusOutlined /> Add Private Row
                </button>
            </div>
        </div>
    );
};

export default TestCases;
