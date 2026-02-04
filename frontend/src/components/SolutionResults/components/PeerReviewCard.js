import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

/**
 * PeerReviewCard Component
 * Displays a single peer review with vote, comment, and proof test details
 */
const PeerReviewCard = ({
    reviewerPseudonym,
    vote,
    voteValid,
    comment,
    proofTestInput,
    proofTestOutput
}) => {
    const getVoteIcon = () => {
        switch (vote) {
            case 'correct':
                return <CheckCircleOutlined className="vote-icon correct" />;
            case 'incorrect':
                return <CloseCircleOutlined className="vote-icon incorrect" />;
            case 'skip':
                return <MinusCircleOutlined className="vote-icon skip" />;
            default:
                return null;
        }
    };

    const getVoteLabel = () => {
        switch (vote) {
            case 'correct':
                return 'Marked as Correct';
            case 'incorrect':
                return 'Marked as Incorrect';
            case 'skip':
                return 'Skipped';
            default:
                return vote;
        }
    };

    const getVoteValidityBadge = () => {
        if (voteValid === null || voteValid === undefined) return null;
        return voteValid
            ? <span className="validity-badge valid">✓ Valid</span>
            : <span className="validity-badge invalid">✗ Invalid</span>;
    };

    return (
        <div className={`peer-review-card ${vote}`} data-testid={`peer-review-${vote}`}>
            <div className="review-header">
                <span className="reviewer-name">{reviewerPseudonym}</span>
                <div className="vote-container">
                    {getVoteIcon()}
                    <span className={`vote-label ${vote}`}>{getVoteLabel()}</span>
                    {getVoteValidityBadge()}
                </div>
            </div>

            {comment && (
                <div className="review-comment">
                    <span className="comment-icon">💬</span>
                    <p className="comment-text">{comment}</p>
                </div>
            )}

            {vote === 'incorrect' && proofTestInput && (
                <div className="proof-test-details">
                    <span className="proof-test-label">Proof Test:</span>
                    <div className="proof-test-content">
                        <span className="test-input">Input: {proofTestInput}</span>
                        <span className="test-arrow">→</span>
                        <span className="test-output">Expected: {proofTestOutput}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

PeerReviewCard.propTypes = {
    reviewerPseudonym: PropTypes.string.isRequired,
    vote: PropTypes.oneOf(['correct', 'incorrect', 'skip']).isRequired,
    voteValid: PropTypes.bool,
    comment: PropTypes.string,
    proofTestInput: PropTypes.string,
    proofTestOutput: PropTypes.string,
};

export default PeerReviewCard;
