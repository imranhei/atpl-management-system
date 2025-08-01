import { Navigate } from "react-router-dom";

const GuestOnlyRoute = ({ isAuthenticated, isLoadingAuth, role, children }) => {
  if (isLoadingAuth) {
    return null; // or a loading spinner
  }

  if (isAuthenticated) {
    // Check if we have a stored path to redirect to
    const lastPath = sessionStorage.getItem('last_path');
    
    if (lastPath && !['/auth/login', '/auth/register'].includes(lastPath)) {
      sessionStorage.removeItem('last_path');
      return <Navigate to={lastPath} replace />;
    }
    
    // Default to role-based dashboard if no stored path
    return (
      <Navigate
        to={role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
        replace
      />
    );
  }

  return children;
};

export default GuestOnlyRoute;