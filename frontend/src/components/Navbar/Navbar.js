import React, { useMemo, useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Space, Switch, Tooltip, Tag } from "antd";
import { UserOutlined, LogoutOutlined, TrophyOutlined, RocketOutlined } from "@ant-design/icons";
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
  const [profile, setProfile] = useState(null);

  // Only show dev controls in development environment
  const showDevControls = process.env.NODE_ENV === 'development';

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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile?.name) return null;
    const names = profile.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
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
          <div className="navbar-logo-icon">
            <TrophyOutlined className="logo-trophy" />
            <RocketOutlined className="logo-rocket" />
          </div>
          <span className="navbar-logo-text">Codify</span>
        </div>
        <div className="navbar-right">
          {/* Only show auth toggle in development mode */}
          {showDevControls && (
            <Tooltip
              title={
                authEnabled
                  ? "Auth ON: Google login + route protection active"
                  : "Auth OFF: Bypass mode (dev only)"
              }
            >
              <div className="auth-toggle">
                {!authEnabled && <span className="auth-off-badge">AUTH OFF</span>}
                <Switch
                  checked={authEnabled}
                  onChange={handleAuthToggle}
                  size="small"
                  aria-label="Toggle authentication"
                />
              </div>
            </Tooltip>
          )}

          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Space className="navbar-profile" style={{ cursor: "pointer" }}>
              <Avatar
                icon={!profile?.profile_url && !getUserInitials() ? <UserOutlined /> : null}
                src={profile?.profile_url}
                size={36}
                style={{
                  backgroundColor: profile?.profile_url ? 'transparent' : '#3b82f6',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                {!profile?.profile_url && getUserInitials()}
              </Avatar>
              {profile?.name && (
                <span className="navbar-user-name">{profile.name.split(' ')[0]}</span>
              )}
              {isDevMode && showDevControls && (
                <Tag color="error" className="dev-mode-tag">DEV</Tag>
              )}
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
