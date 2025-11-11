import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Radio, Space, Table, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { mockMatchSettings } from "../../data/mockData";
import "./MatchSettingsList.css";

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Ready: "success",
  Draft: "default",
};

const normalizeStatus = (status) => {
  if (!status) return status;
  const s = String(status).toLowerCase();
  if (s === "ready") return "Ready";
  if (s === "draft") return "Draft";
  return status;
};

const MatchSettingsList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  // useMemo to avoid recalculating items on every render
  const items = useMemo(
    () =>
      (mockMatchSettings || []).map((it, idx) => ({
        key: it.id ?? idx,
        id: it.id ?? idx,
        name: it.name,
        status: normalizeStatus(it.status),
      })),
    []
  );

  // Filtered items based on selected filter
  const filteredItems = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((it) => it.status === filter);
  }, [items, filter]);

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
      width: 140,
      render: (status) => (
        <Tag color={STATUS_COLOR[status] || "default"}>{status}</Tag>
      ),
    },
  ];

  // Render component
  return (
    <div className="match-settings-list-container">
      <Card className="match-settings-card">
        {/* Header */}
        <div className="page-header">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Title level={2} className="page-title">
            Match Settings
          </Title>
          <span /> {/* spacer to keep title centered */}
        </div>

        {/* Optional helper text */}
        <div className="subheader">
          <Text type="secondary">
            Browse existing match settings. Use the filter to narrow results.
          </Text>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <Space size="middle" align="center" wrap>
            <Text strong>Filter:</Text>
            <Radio.Group
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-radio-group"
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="All">All</Radio.Button>
              <Radio.Button value="Ready">Ready</Radio.Button>
              <Radio.Button value="Draft">Draft</Radio.Button>
            </Radio.Group>
          </Space>
        </div>

        {/* Table */}
        <Table
          dataSource={filteredItems}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          rowKey="id"
          className="match-settings-table"
          locale={{ emptyText: "No match settings found." }}
        />
      </Card>
    </div>
  );
};

export default MatchSettingsList;
