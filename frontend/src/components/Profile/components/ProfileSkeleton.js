import React from 'react';
import { Skeleton } from 'antd';


const ProfileSkeleton = () => {
  return (
    <div className="profile-container">
      <Skeleton active avatar paragraph={{ rows: 10 }} />
    </div>
  );
};

export default ProfileSkeleton;
