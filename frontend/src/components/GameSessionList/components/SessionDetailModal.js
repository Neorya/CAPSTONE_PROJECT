import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Tag, Typography, Spin } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import MatchSelectionTable from './MatchSelectionTable';

const { Text } = Typography;

/**
 * SessionDetailModal - Modal component for viewing and editing session details
 * Supports two modes: 'view' (read-only) and 'edit' (editable with match selection)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} props.mode - 'view' or 'edit'
 * @param {Object} props.form - Ant Design form instance
 * @param {boolean} props.loading - Loading state for save operation
 * @param {Function} props.onSave - Callback when save is clicked
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSwitchToEdit - Callback to switch from view to edit mode
 * @param {Array} props.matches - Array of match objects for view mode
 * @param {boolean} props.matchesLoading - Loading state for matches (view mode)
 * @param {Array} props.allMatches - All available matches for selection (edit mode)
 * @param {Array} props.selectedMatchIds - Currently selected match IDs (edit mode)
 * @param {boolean} props.allMatchesLoading - Loading state for all matches (edit mode)
 * @param {Function} props.onMatchSelectionChange - Callback when match selection changes
 * @param {boolean} props.isFormValid - Whether the form is valid for submission
 * @returns {JSX.Element} Modal component
 */
const SessionDetailModal = ({
  isOpen,
  mode,
  form,
  loading,
  onSave,
  onClose,
  onSwitchToEdit,
  matches = [],
  matchesLoading = false,
  allMatches = [],
  selectedMatchIds = [],
  allMatchesLoading = false,
  onMatchSelectionChange,
  isFormValid = true,
}) => {
  const isViewMode = mode === 'view';
  const title = isViewMode ? 'Game Session Details' : 'Edit Game Session';

  /**
   * Renders footer buttons based on current mode
   */
  const renderFooter = () => {
    if (isViewMode) {
      return [
        <Button
          key="edit"
          type="primary"
          onClick={onSwitchToEdit}
        >
          Edit
        </Button>,
        <Button
          key="close"
          onClick={onClose}
          style={{ backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' }}
        >
          Close
        </Button>,
      ];
    }

    // Edit mode footer
    return [
      <Button
        key="cancel"
        onClick={onClose}
      >
        Cancel
      </Button>,
      <Button
        key="save"
        type="primary"
        onClick={onSave}
        loading={loading}
        disabled={!isFormValid}
      >
        Save Changes
      </Button>,
    ];
  };

  /**
   * Renders the matches section in view mode (read-only tags)
   */
  const renderViewModeMatches = () => {
    return (
      <div style={{ marginTop: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          <TagOutlined style={{ marginRight: 6 }} />
          Selected Matches ({matches.length})
        </Text>
        {matchesLoading ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <Spin size="small" />
          </div>
        ) : matches.length > 0 ? (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            padding: '12px',
            backgroundColor: '#fafafa',
            borderRadius: 8,
            border: '1px solid #f0f0f0'
          }}>
            {matches.map((match) => (
              <Tag
                key={match.match_id}
                color="blue"
                style={{
                  margin: 0,
                  padding: '4px 12px',
                  fontSize: 13,
                  borderRadius: 4
                }}
              >
                {match.title}
              </Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary" style={{ fontStyle: 'italic' }}>
            No matches associated with this session
          </Text>
        )}
      </div>
    );
  };

  /**
   * Renders the matches section in edit mode (selectable table)
   */
  const renderEditModeMatches = () => {
    return (
      <MatchSelectionTable
        matches={allMatches}
        selectedMatchIds={selectedMatchIds}
        onSelectionChange={onMatchSelectionChange}
        loading={allMatchesLoading}
        disabled={loading}
        pageSize={5}
      />
    );
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onSave}
      onCancel={onClose}
      footer={renderFooter()}
      confirmLoading={loading}
      destroyOnClose
      width={560}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isViewMode}
      >
        <Form.Item
          name="name"
          label="Game Session Name"
          rules={[
            { required: true, message: 'Please enter a game session name' },
            { min: 5, message: 'Game session name must be at least 5 characters' },
            { max: 100, message: 'Game session name must not exceed 100 characters' },
          ]}
        >
          <Input
            placeholder="Enter game session name"
            showCount={!isViewMode}
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          name="start_date"
          label="Start Date"
          rules={[{ required: true, message: 'Please select a start date' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="duration_phase1"
          label="First Phase Duration"
          rules={[]}
        >
          <Input
            placeholder="First Phase Duration"
            showCount={!isViewMode}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item
          name="duration_phase2"
          label="Second Phase Duration"
          rules={[]}
        >
          <Input
            placeholder="Second Phase Duration"
            showCount={!isViewMode}
            maxLength={100}
          />
        </Form.Item>
      </Form>

      {/* Render appropriate matches section based on mode */}
      {isViewMode ? renderViewModeMatches() : renderEditModeMatches()}
    </Modal>
  );
};

export default SessionDetailModal;
