import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Radio, Space, Table, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { mockMatchSettings } from "../../data/mockData";
import "./MatchSettingDetails.css";

// Page to see the match' details when browsing match setting. The details will be shown in a popup.
// (Waiting for professors feedback to know if we need to implement it in Sprint 1)

const { Title, Text } = Typography;

const STATUS_COLOR = {
  Ready: "success",
  Draft: "default",
};

