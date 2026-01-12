import React from 'react';
import { Modal, Button, Input } from 'antd';

const AddTestModal = ({
    open,
    onCancel,
    onAdd,
    input,
    setInput,
    output,
    setOutput
}) => {
    return (
        <Modal
            title="Add New Test Case"
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onAdd}>
                    Create New Test
                </Button>,
            ]}
        >
            <div className="form-group">
                <label>Input</label>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 1, 2, 3"
                    className="modal-input"
                />
            </div>
            <div className="form-group modal-form-group">
                <label>Expected Output</label>
                <Input
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    placeholder="e.g. 6"
                    className="modal-input"
                />
            </div>
        </Modal>
    );
};

export default AddTestModal;
