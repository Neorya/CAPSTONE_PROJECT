import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Space, Button } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  logout,
  isDevModeEnabled,
  isAuthEnabled,
  disableDevMode,
  removeToken,
} from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const isDevMode = isDevModeEnabled();
  const authEnabled = isAuthEnabled();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile in navbar:", err);
      }
    };
    if (authEnabled) {
      fetchProfile();
    }
  }, [authEnabled]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };



  const menuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleHomeClick = () => {
    navigate("/");
  };
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  return (
    <Header className="navbar-header">
      <div className="navbar-content">
        <div className="navbar-logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
          <span>Codify</span>
        </div>
        <div className="navbar-right">
          <Button
            id="back-to-home-button"
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
            shape="circle"
            size="large"
          />


          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Space className="navbar-profile" style={{ cursor: "pointer" }}>
              <Avatar
                icon={<UserOutlined />}
                src={profile?.profile_url}
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
