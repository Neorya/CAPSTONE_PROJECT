import React from 'react';
import { Table, Checkbox, Typography, Alert, Spin } from 'antd';
import { TagOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * MatchSelectionTable - Reusable component for selecting/deselecting matches
 * Used in both GameSessionCreation and SessionDetailModal (edit mode)
 * 
 * @param {Object} props
 * @param {Array} props.matches - All available matches
 * @param {Array} props.selectedMatchIds - Currently selected match IDs
 * @param {Function} props.onSelectionChange - Callback when selection changes (receives updated array of IDs)
 * @param {boolean} props.loading - Loading state for matches
 * @param {boolean} props.disabled - Whether selection is disabled
 * @param {number} props.pageSize - Number of items per page (default: 5)
 * @returns {JSX.Element} Match selection table component
 */
const MatchSelectionTable = ({
  matches = [],
  selectedMatchIds = [],
  onSelectionChange,
  loading = false,
  disabled = false,
  pageSize = 5,
}) => {
  const selectedCount = selectedMatchIds.length;
  const showMinimumWarning = selectedCount === 0;

  /**
   * Handles checkbox change for a match
   * @param {number} matchId - ID of the match
   * @param {boolean} checked - Whether the checkbox is checked
   */
  const handleCheckboxChange = (matchId, checked) => {
    if (disabled) return;

    let newSelection;
    if (checked) {
      newSelection = [...selectedMatchIds, matchId];
    } else {
      newSelection = selectedMatchIds.filter(id => id !== matchId);
    }
    onSelectionChange(newSelection);
  };

  /**
   * Table columns configuration
   */
  const columns = [
    {
      title: 'Match Name',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Text style={{ fontWeight: 500 }}>{text}</Text>
      ),
    },
    {
      title: 'Selected',
      key: 'select',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const isSelected = selectedMatchIds.includes(record.match_id);
        return (
          <Checkbox
            checked={isSelected}
            onChange={(e) => handleCheckboxChange(record.match_id, e.target.checked)}
            disabled={disabled}
          />
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Spin size="default" />
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Loading matches...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
      }}>
        <Text strong style={{ fontSize: 14 }}>
          <TagOutlined style={{ marginRight: 6 }} />
          Selected Matches
        </Text>
        <Text
          type={selectedCount > 0 ? 'secondary' : 'danger'}
          style={{ fontSize: 13 }}
        >
          {selectedCount} selected
        </Text>
      </div>

      {/* Minimum Selection Warning */}
      {showMinimumWarning && (
        <Alert
          message="At least one match must be selected"
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
        />
      )}

      {/* Matches Table */}
      <Table
        dataSource={matches}
        columns={columns}
        rowKey="match_id"
        pagination={{
          pageSize,
          showSizeChanger: false,
          size: 'small',
          hideOnSinglePage: matches.length <= pageSize
        }}
        size="small"
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: 8,
        }}
        locale={{ emptyText: 'No matches available' }}
      />
    </div>
  );
};

export default MatchSelectionTable;

