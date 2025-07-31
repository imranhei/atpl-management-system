import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, role, children, allowedRole }) => {

  if (allowedRole === undefined) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CheckAuth;
