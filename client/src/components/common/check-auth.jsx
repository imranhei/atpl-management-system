import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, role, children }) => {
  const location = useLocation();
  const { pathname } = location;

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/employee/dashboard" />;
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
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/employee/dashboard" />;
    }
  }

  if (
    isAuthenticated &&
    (role === "admin") &&
    pathname.includes("employee")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
