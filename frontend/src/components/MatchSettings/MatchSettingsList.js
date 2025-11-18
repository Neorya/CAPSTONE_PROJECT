import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Radio, Space, Table, Tag, Typography, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchMatchSettings } from "../../services/matchSettingsService.js";
import "./MatchSettingsList.css";

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Ready: "success",
  Draft: "default",
};

const MatchSettingsList = () => {
  const navigate = useNavigate();                     // navigation hook
  const [filter, setFilter] = useState("All");        // filter state (all, ready, draft)
  const [items, setItems] = useState([]);             // match settings items
  const [loading, setLoading] = useState(false);      // loading

  useEffect(() => {                         // useEffect runs on component mount and filter change
    const fetchItems = async () => {        // fetch match settings based on filter
      try {
        setLoading(true);
        const data = await fetchMatchSettings(filter);
        const formatted = data.map((item) => ({   // format data for table
          id: item.match_set_id,
          name: item.title,
          status: item.is_ready ? "Ready" : "Draft",
        }));
        setItems(formatted);
      } catch (err) {
        console.error("Error fetching match settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [filter]);

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
        <div className="page-header">
          <Tooltip title="Back to Home">
            <Button 
              id="back-to-home-button"
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/')}
              shape="circle"
              size="large"
            />
          </Tooltip>
          <Title level={2} className="page-title">
            Match Settings
          </Title>
          <span />
        </div>

        <div className="subheader">
          <Text type="secondary">
            Browse existing match settings. Use the filter to narrow results.
          </Text>
        </div>

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
    </div>
  );
};

export default MatchSettingsList;
