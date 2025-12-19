import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import "./AppLayout.css";

const { Content } = Layout;

/**
 * AppLayout Component
 * Wraps protected routes with navbar and layout
 */
const AppLayout = ({ children }) => {
  return (
    <Layout className="app-layout">
      <Navbar />
      <Content className="app-content">
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
