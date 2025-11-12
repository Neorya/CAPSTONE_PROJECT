import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Radio, Space, Table, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { mockMatchSettings } from "../../data/mockData";
import "./MatchSettingDetail.css";

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Ready: "success",
  Draft: "default",
};

