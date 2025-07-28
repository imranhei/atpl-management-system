import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, role, children }) => {
  const location = useLocation();
  const { pathname } = location;

  // ✅ Match paths like /leave-review/:id
  const isStandaloneProtected = pathname.startsWith("/leave-review");
  sessionStorage.setItem("last_path", location.pathname + location.search); // ✅

  // if (isStandaloneProtected && !isAuthenticated) {
  //   return <Navigate to="/auth/login" />;
  // }

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (role === "admin") {
        if (isStandaloneProtected) {
          const lastPath = sessionStorage.getItem("last_path");
          return <Navigate to={`${lastPath}`} />;
        } else {
          return <Navigate to="/admin/dashboard" />;
        }
      } else {
        return <Navigate to="/employee/dashboard" />;
      }
    }
  }

  const authRoutes = ["admin", "employee", "leave-review"];
  const isAuthRoute = authRoutes.some((route) => pathname.includes(route));
  if (!isAuthenticated && isAuthRoute) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (pathname.includes("auth/login") || pathname.includes("auth/register"))
  ) {
    if (role === "admin") {
      if (isStandaloneProtected) {
        const lastPath = sessionStorage.getItem("last_path");
        return <Navigate to={`${lastPath}`} />;
      } else {
        return <Navigate to="/admin/dashboard" />;
      }
    } else {
      return <Navigate to="/employee/dashboard" />;
    }
  }

  if (isAuthenticated && role === "admin" && pathname.includes("employee")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
