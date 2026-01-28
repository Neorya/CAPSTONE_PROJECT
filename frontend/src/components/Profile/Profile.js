import React, { useCallback } from 'react';
import { Row, Col, message } from 'antd';
import { useProfile, useEditProfileModal } from './hooks';
import {
  ProfileHeader,
  StudentStats,
  TeacherStats,
  BadgesCard,
  AccountInfoCard,
  EditProfileModal,
  ProfileSkeleton,
  ProfileError,
} from './components';
import './Profile.css';


const Profile = () => {
  // Alert handlers
  const showSuccess = useCallback((msg) => {
    message.success(msg);
  }, []);

  const showError = useCallback((msg) => {
    message.error(msg);
  }, []);

  // Custom hooks for state management
  const {
    profile,
    badges,
    loading,
    error,
    updateProfile,
  } = useProfile(showSuccess, showError);

  const {
    isVisible: isEditModalVisible,
    form,
    open: openEditModal,
    close: closeEditModal,
    getFormValues,
  } = useEditProfileModal();

  /**
   * Handles edit profile button click
   */
  const handleEditClick = useCallback(() => {
    openEditModal(profile);
  }, [openEditModal, profile]);

  /**
   * Handles profile update submission
   */
  const handleUpdateProfile = useCallback(async (values) => {
    const success = await updateProfile(values);
    if (success) {
      closeEditModal();
    }
  }, [updateProfile, closeEditModal]);

  // Loading state
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Error state
  if (error || !profile) {
    return <ProfileError error={error} />;
  }

  const { role } = profile;

  return (
    <div className="profile-container">
      {/* Header Section */}
      <ProfileHeader profile={profile} onEditClick={handleEditClick} />

      <Row gutter={[24, 24]} className="profile-content-row">
        {/* Main Stats Column */}
        <Col xs={24} md={16}>
          {role === 'student' && <StudentStats profile={profile} />}
          {role === 'teacher' && <TeacherStats profile={profile} />}
        </Col>

        {/* Sidebar Column */}
        <Col xs={24} md={8}>
          {role === 'student' && <BadgesCard badges={badges} />}
          <AccountInfoCard />
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isVisible={isEditModalVisible}
        form={form}
        onCancel={closeEditModal}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
