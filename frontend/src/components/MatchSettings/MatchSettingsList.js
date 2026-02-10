import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Radio, Space, Table, Tag, Typography, Tooltip, Alert, Input } from "antd";
import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useMatchSettings } from "./hooks/useMatchSettings";
import MatchSettingDetailsPopup from "./components/MatchSettingDetailsPopup";
import MatchSettingActionButtons from "./components/MatchSettingActionButtons";
import "./MatchSettingsList.css";
import PopupAlert from '../common/PopupAlert';

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Ready: "success",
  Draft: "default",
};

/**
 * MatchSettingsList - Main component for displaying and managing match settings
 * Features: browse, filter, view details, clone, edit, delete, and publish
 */
const MatchSettingsList = () => {
  const navigate = useNavigate();

  // Local state for search and sort (not provided by useMatchSettings hook)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState({ field: 'id', order: 'descend' });

  // Error state
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // Alert handlers
  const showAlert = useCallback((type, msg) => {
    if (type === 'error') {
      setError(msg);
    } else if (type === 'success') {
      setSuccess(msg);
    }
  }, []);

  const showSuccess = useCallback((msg) => {
    setSuccess(msg);
  }, []);

  // Custom hooks
  const {
    items,
    loading,
    filter,
    setFilter,
    updateMatchSetting,
    deleteMatchSetting,
    cloneMatchSetting,
    publishMatchSetting,
    selectedMatchSetting,
    isPopupVisible,
    openPopup,
    closePopup
  } = useMatchSettings(showAlert, showSuccess);

  // Edit handler — navigate to full edit page
  const handleOpenEdit = useCallback((matchSetting) => {
    navigate(`/match-settings/${matchSetting.id}/edit`);
  }, [navigate]);

  // Handle table change (sorting)
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSortOrder({ field: sorter.field, order: sorter.order });
    } else {
      setSortOrder({ field: 'id', order: 'descend' }); // Default sort to latest
    }
  };

  // Toggle sort by creation date (id)
  const toggleCreatedSort = () => {
    const isNewest = sortOrder.field === 'id' && sortOrder.order === 'descend';
    setSortOrder({
      field: 'id',
      order: isNewest ? 'ascend' : 'descend'
    });
  };


  // Filter and Sort items
  const processedItems = React.useMemo(() => {
    let result = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder.field && sortOrder.order) {
      result.sort((a, b) => {
        let valA = a[sortOrder.field];
        let valB = b[sortOrder.field];

        // Handle string comparison nicely
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder.order === 'ascend' ? -1 : 1;
        if (valA > valB) return sortOrder.order === 'ascend' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [items, searchTerm, sortOrder]);


  // Table columns definition
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={STATUS_COLOR[status] || "default"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 220,
      render: (_, record) => (
        <MatchSettingActionButtons
          matchSetting={record}
          onView={openPopup}
          onClone={cloneMatchSetting}
          onEdit={handleOpenEdit}
          onDelete={deleteMatchSetting}
          onPublish={publishMatchSetting}
        />
      ),
    },
  ];

  // Render component
  return (
    <div className="match-settings-list-container">
      <Card className="match-settings-card">
        <div className="page-header">
          <Tooltip title="Back to Home">
            <Button
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/home')}
              shape="circle"
              size="large"
            />
          </Tooltip>
          <Title level={2} className="page-title" id="page-title">
            Match Settings
          </Title>
          <span />
        </div>

        <div className="subheader">
          <Text type="secondary">
            Browse, clone, edit, delete, or publish match settings.
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <PopupAlert
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        {/* Success Alert */}
        {success && (
          <PopupAlert
            message={success}
            type="success"
            onClose={() => setSuccess(null)}
          />
        )}


        <div className="filter-bar">
          <div className="filter-controls">
            <div className="left-filters">
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 220 }}
                allowClear
              />
              <Space size="middle" align="center" wrap className="filter-group">
                <Text strong>Filter Status:</Text>
                <Radio.Group
                  id="filter-radio-group"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-radio-group"
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button id="filter-opt-all" value="All">All</Radio.Button>
                  <Radio.Button id="filter-opt-ready" value="Ready">Ready</Radio.Button>
                  <Radio.Button id="filter-opt-draft" value="Draft">Draft</Radio.Button>
                </Radio.Group>
              </Space>
            </div>

            <div className="right-filters">
              <Tooltip title={
                sortOrder.field === 'id' && sortOrder.order === 'descend'
                  ? "Sort by Oldest First"
                  : "Sort by Latest First"
              }>
                <Button
                  icon={<ClockCircleOutlined />}
                  onClick={toggleCreatedSort}
                  type={sortOrder.field === 'id' ? "primary" : "default"}
                  ghost={sortOrder.field === 'id'}
                  className="sort-button"
                >
                  {sortOrder.field === 'id' && sortOrder.order === 'descend' ? " Latest" : " Oldest"}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <Table
          dataSource={processedItems}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          onChange={handleTableChange}
          rowKey="id"
          className="match-settings-table"
          locale={{ emptyText: "No match settings found." }}
        />
      </Card>

      {/* Details Popup (View mode) */}
      <MatchSettingDetailsPopup
        visible={isPopupVisible}
        onClose={closePopup}
        matchSetting={selectedMatchSetting}
      />
    </div>
  );
};

export default MatchSettingsList;
