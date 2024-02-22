import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const TokenProtectedRoute = ({ children }) => {
  const location = useLocation();
  const hasToken = new URLSearchParams(location.search).get("token");

  if (!hasToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default TokenProtectedRoute;
