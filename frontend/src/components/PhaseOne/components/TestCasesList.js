import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TestCaseItem from './TestCaseItem';

const TestCasesList = ({
    publicTests,
    customTests,
    onAddTestClick,
    onDeleteTest
}) => {
    return (
        <div className="tests-container">
            <div className="section-title">Public Tests</div>
            <div className="section-subtitle">Provided by the system.</div>

            {publicTests.map((test, index) => (
                <TestCaseItem key={test.id} test={test} label={`Test Case ${index + 1}`} />
            ))}

            <div className="custom-tests-header">
                <div>
                    <div className="section-title">My Custom Tests</div>
                    <div className="section-subtitle">Tests you have added.</div>
                </div>
                <Button
                    type="primary"
                    ghost
                    icon={<PlusOutlined />}
                    onClick={onAddTestClick}
                >
                    Add New Test Case
                </Button>
            </div>

            {customTests.map((test, index) => (
                <TestCaseItem
                    key={test.id}
                    test={test}
                    label={`My Test ${index + 1}`}
                    onDelete={() => onDeleteTest(index)}
                />
            ))}
        </div>
    );
};

export default TestCasesList;
