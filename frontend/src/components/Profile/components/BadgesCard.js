import React from 'react';
import { Card, Empty, Tooltip, Typography, Image } from 'antd';
import { getBadgeIcon } from '../constants';

const { Text } = Typography;

/**
 * BadgesCard - Displays earned badges for student users
 * 
 * @param {Object} props
 * @param {Array} props.badges - Array of badge objects
 * @returns {JSX.Element} Badges card component
 */
const BadgesCard = ({ badges }) => {
  return (
    <Card title="Badges" className="badges-card">
      {badges.length > 0 ? (
        <div className="badges-grid">
          {badges.map(badge => (
            <Tooltip title={badge.description} key={badge.badge_id}>
              <div className="badge-item">
                <Image
                  src={getBadgeIcon(badge)}
                  alt={badge.name}
                  width={64}
                  preview={false}
                  fallback="/badges/default.png"
                />
                <Text type="secondary" style={{ fontSize: 10 }}>{badge.name}</Text>
              </div>
            </Tooltip>
          ))}
        </div>
      ) : (
        <Empty description="No badges earned yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

export default BadgesCard;
