import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("userRole");

  // 🔒 If no token, redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // ⚠️ If token exists but role is not allowed, redirect to unauthorized
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
