import React from 'react';
import { Button } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const FloatingRankButton = ({ onClick, currentUserRank }) => {
    if (!currentUserRank) return null;

    return (
        <div className="floating-rank-button-wrapper" id="floating-rank-button-wrapper">
            <Button
                type="primary"
                shape="circle"
                icon={<TrophyOutlined />}
                onClick={onClick}
                className="floating-rank-button"
                id="floating-rank-button"
                title="View Your Rank"
            />
        </div>
    );
};

export default FloatingRankButton;

