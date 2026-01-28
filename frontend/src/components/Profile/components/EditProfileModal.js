import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

/**
 * EditProfileModal - Modal for editing user profile
 * 
 * @param {Object} props
 * @param {boolean} props.isVisible - Modal visibility state
 * @param {Object} props.form - Ant Design form instance
 * @param {Function} props.onCancel - Callback for cancel action
 * @param {Function} props.onSubmit - Callback for form submission
 * @returns {JSX.Element} Edit profile modal component
 */
const EditProfileModal = ({ isVisible, form, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Edit Profile"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
