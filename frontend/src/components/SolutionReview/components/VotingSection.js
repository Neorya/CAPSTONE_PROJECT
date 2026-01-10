import React from 'react';
import { Radio, Space } from 'antd';

const VotingSection = ({ voteType, isPhaseEnded, onVoteChange }) => {
    return (
        <div className="voting-section">
            <Radio.Group
                onChange={onVoteChange}
                value={voteType}
                disabled={isPhaseEnded}
                className="vote-radio-group"
            >
                <Space direction="horizontal" size="large">
                    <Radio
                        id="vote-incorrect"
                        value="incorrect"
                        className="vote-radio incorrect"
                    >
                        <span className="vote-label">Incorrect</span>
                    </Radio>
                    <Radio
                        id="vote-correct"
                        value="correct"
                        className="vote-radio correct"
                    >
                        <span className="vote-label">Correct</span>
                    </Radio>
                    <Radio
                        id="vote-skip"
                        value="skip"
                        className="vote-radio skip"
                    >
                        <span className="vote-label">Skip this review</span>
                    </Radio>
                </Space>
            </Radio.Group>
        </div>
    );
};

export default VotingSection;
