import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const { pathname } = location;

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin" || user?.role === "super-admin") {
        return <Navigate to="/admin/attendance" />;
      } else {
        return <Navigate to="/employee/attendance" />;
      }
    }
  }

  const authRoutes = ["admin", "employee"];
  const isAuthRoute = authRoutes.some((route) => pathname.includes(route));
  if (!isAuthenticated && isAuthRoute) {

    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (pathname.includes("auth/login") || pathname.includes("auth/register"))
  ) {
    if (user?.role === "admin" || user?.role === "super-admin") {
      return <Navigate to="/admin/attendance" />;
    } else {
      return <Navigate to="/employee/attendance" />;
    }
  }

  if (
    isAuthenticated &&
    (user?.role === "admin" || user?.role === "super-admin") &&
    location.pathname === "/"
  ) {
    return <Navigate to="/admin/attendance" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
