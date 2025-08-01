import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  isAuthenticated,
  isLoadingAuth,
  role,
  allowedRoles,
  publicAccess = false,
  children,
}) => {
  const location = useLocation();

  useEffect(() => {
    // Always store the current path if not loading and not an auth route
    if (!isLoadingAuth) {
      const path = location.pathname + location.search;
      if (!["/auth/login", "/auth/register"].includes(path)) {
        sessionStorage.setItem("last_path", path);
      }
    }
  }, [location, isLoadingAuth]);

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // For public routes, show content (which should handle unauthorized UI)
    if (publicAccess) return children;
    
    // For protected routes, redirect to login
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;