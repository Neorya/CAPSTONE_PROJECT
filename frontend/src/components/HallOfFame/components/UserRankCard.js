import React from 'react';
import { Card, Button, Typography } from 'antd';
import { EnvironmentOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const UserRankCard = ({ currentUserRank, handleWhereAmI, isOpen, onClose }) => {
    if (!currentUserRank) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                id="drawer-overlay"
            />

            {/* Drawer */}
            <div className={`rank-drawer ${isOpen ? 'open' : ''}`} id="rank-drawer">
                <div className="drawer-header" id="drawer-header">
                    <h2 id="drawer-title">Your Rank</h2>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onClose}
                        className="drawer-close-button"
                        id="drawer-close-button"
                    />
                </div>

                <div className="drawer-content" id="drawer-content">
                    <div className="rank-info" id="rank-info">
                        <div className="rank-item" id="rank-item-rank">
                            <Text strong>Rank:</Text>
                            <Text className="rank-value" id="drawer-rank-value">{currentUserRank.rank}</Text>
                        </div>
                        <div className="rank-item" id="rank-item-score">
                            <Text strong>Score:</Text>
                            <Text className="rank-value" id="drawer-score-value">{currentUserRank.score.toFixed(2)}</Text>
                        </div>
                        {currentUserRank.points_to_next_rank != null && (
                            <div className="rank-item next-rank" id="rank-item-next-rank">
                                <Text strong>Next Rank:</Text>
                                <Text className="points-needed" id="drawer-points-needed">
                                    +{currentUserRank.points_to_next_rank.toFixed(2)} points needed
                                </Text>
                            </div>
                        )}
                    </div>
                    <Button
                        type="primary"
                        icon={<EnvironmentOutlined />}
                        onClick={() => {
                            handleWhereAmI();
                            onClose();
                        }}
                        className="where-am-i-button"
                        id="drawer-where-am-i-button"
                        block
                    >
                        Where am I
                    </Button>
                </div>
            </div>
        </>
    );
};

export default UserRankCard;

