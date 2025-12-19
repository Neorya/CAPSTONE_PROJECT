import React from "react";
import { Layout, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout, isDevModeEnabled } from "../../services/authService";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const isDevMode = isDevModeEnabled();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <Header className="navbar-header">
      <div className="navbar-content">
        <div className="navbar-logo">
          <span>Codify</span>
        </div>
        <div className="navbar-right">
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Space className="navbar-profile" style={{ cursor: "pointer" }}>
              <Avatar
                icon={<UserOutlined />}
                size="default"
                style={{ backgroundColor: "#1890ff" }}
              />
              {isDevMode && (
                <span className="dev-mode-badge">DEV</span>
              )}
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
