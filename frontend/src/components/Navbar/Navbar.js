import React, { useMemo, useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Space, Switch, Tooltip } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  logout,
  isDevModeEnabled,
  isAuthEnabled,
  setAuthEnabledOverride,
  disableDevMode,
  removeToken,
} from "../../services/authService";
import { getUserProfile } from "../../services/userService";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const isDevMode = isDevModeEnabled();
  const authEnabled = useMemo(() => isAuthEnabled(), []);
  console.log("authEnabled", authEnabled);
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

  const handleAuthToggle = (checked) => {
    // Persist override and reload so route guards pick it up immediately.
    setAuthEnabledOverride(checked);

    // If enabling auth, clear any bypass token/dev mode so user must login properly.
    if (checked) {
      disableDevMode();
      removeToken();
      window.location.href = "/login";
      return;
    }

    // If disabling auth, go back to home.
    window.location.href = "/";
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
        <div className="navbar-logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
          <span>Codify</span>
        </div>
        <div className="navbar-right">
          <Tooltip
            title={
              authEnabled
                ? "Authentication is ON (Google login + route protection active)"
                : "Authentication is OFF (bypasses route protection + token validation)"
            }
          >
            <div className="auth-toggle">
              {!authEnabled && <span className="auth-off-badge">AUTH OFF</span>}
              <Switch
                checked={authEnabled}
                onChange={handleAuthToggle}
                checkedChildren="Auth"
                unCheckedChildren="Auth"
                aria-label="Toggle authentication"
              />
            </div>
          </Tooltip>
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
