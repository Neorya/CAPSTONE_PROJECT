import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { validateToken } from "../services/authService";

/**
 * PublicRoute Component
 * For public routes like login page
 * Redirects to home if user is already authenticated
 */
const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        aria-live="polite"
        aria-busy="true"
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to home (root) if already authenticated
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show public route (login page)
  return children;
};

export default PublicRoute;
