import React from 'react';
import PropTypes from 'prop-types';
import PeerReviewCard from './PeerReviewCard';

/**
 * PeerReviewsSection Component
 * Displays all peer reviews received on a solution
 */
const PeerReviewsSection = ({
    reviews,
    totalReviews,
    correctVotes,
    incorrectVotes,
    sectionId
}) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="peer-reviews-section empty" id={sectionId}>
                <h3 className="section-header">PEER REVIEW FEEDBACK</h3>
                <div className="no-reviews-container">
                    <p className="no-reviews-message">
                        No peer reviews received yet.
                    </p>
                    <p className="no-reviews-hint">
                        Peer reviews will appear here after Phase 2 is complete.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="peer-reviews-section" id={sectionId}>
            <h3 className="section-header">
                PEER REVIEW FEEDBACK ({totalReviews} reviews)
            </h3>
            <div className="review-summary">
                <span className="summary-item correct">
                    ✓ {correctVotes} Correct
                </span>
                <span className="summary-item incorrect">
                    ✗ {incorrectVotes} Incorrect
                </span>
            </div>
            <div className="peer-reviews-list">
                {reviews.map((review) => (
                    <PeerReviewCard
                        key={review.review_id}
                        reviewerPseudonym={review.reviewer_pseudonym}
                        vote={review.vote}
                        voteValid={review.vote_valid}
                        comment={review.comment}
                        proofTestInput={review.proof_test_input}
                        proofTestOutput={review.proof_test_output}
                    />
                ))}
            </div>
        </div>
    );
};

PeerReviewsSection.propTypes = {
    reviews: PropTypes.arrayOf(
        PropTypes.shape({
            review_id: PropTypes.number.isRequired,
            reviewer_pseudonym: PropTypes.string.isRequired,
            vote: PropTypes.string.isRequired,
            vote_valid: PropTypes.bool,
            comment: PropTypes.string,
            proof_test_input: PropTypes.string,
            proof_test_output: PropTypes.string,
        })
    ).isRequired,
    totalReviews: PropTypes.number.isRequired,
    correctVotes: PropTypes.number.isRequired,
    incorrectVotes: PropTypes.number.isRequired,
    sectionId: PropTypes.string.isRequired,
};

export default PeerReviewsSection;
