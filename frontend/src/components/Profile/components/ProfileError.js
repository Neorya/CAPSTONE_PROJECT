import React from 'react';
import { Card, Empty } from 'antd';

/**
 * ProfileError - Error state display for profile page
 * 
 * @param {Object} props
 * @param {string} props.error - Error message to display
 * @returns {JSX.Element} Profile error component
 */
const ProfileError = ({ error }) => {
  return (
    <div className="profile-container">
      <Card className="error-card">
        <Empty description={error || "Profile not found"} />
      </Card>
    </div>
  );
};

export default ProfileError;
