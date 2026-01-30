import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Radio, Space, Table, Tag, Typography, Tooltip, message, Alert } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMatchSettings } from "./hooks/useMatchSettings";
// import { useMatchSettingDetails } from "./hooks/useMatchSettingDetails";
import MatchSettingDetailsPopup from "./components/MatchSettingDetailsPopup";
import MatchSettingActionButtons from "./components/MatchSettingActionButtons";
import MatchSettingEditModal from "./components/MatchSettingEditModal";
import "./MatchSettingsList.css";

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

  // Error state
  const [error, setError] = useState(null);

  // Edit modal state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Alert handlers
  const showAlert = useCallback((type, msg) => {
    if (type === 'error') {
      setError(msg);
    }
  }, []);

  const showSuccess = useCallback((msg) => {
    message.success(msg);
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

  // const {
  //   selectedMatchSetting,
  //   isPopupVisible,
  //   openPopup,
  //   closePopup
  // } = useMatchSettingDetails();

  // Edit handlers
  const handleOpenEdit = useCallback((matchSetting) => {
    setSelectedForEdit(matchSetting);
    setIsEditModalVisible(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditModalVisible(false);
    setSelectedForEdit(null);
  }, []);

  const handleSaveEdit = useCallback(async (id, values) => {
    setEditLoading(true);
    const success = await updateMatchSetting(id, values);
    setEditLoading(false);
    if (success) {
      handleCloseEdit();
    }
  }, [updateMatchSetting, handleCloseEdit]);

  // Table columns definition
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        <div className="filter-bar">
          <Space size="middle" align="center" wrap>
            <Text strong>Filter:</Text>
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

        <Table
          dataSource={items}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
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

      {/* Edit Modal */}
      <MatchSettingEditModal
        visible={isEditModalVisible}
        matchSetting={selectedForEdit}
        loading={editLoading}
        onSave={handleSaveEdit}
        onCancel={handleCloseEdit}
      />
    </div>
  );
};

export default MatchSettingsList;
