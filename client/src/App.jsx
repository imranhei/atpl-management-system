import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import CheckAuth from "./components/common/check-auth";
import SystemLayout from "./components/user-view/layout";
import TodayMeals from "./pages/user-view/day-wise-meal";
import Meal from "./pages/user-view/meal";
import EmployeeLeave from "./pages/user-view/leave"; 
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { LoaderCircle } from "lucide-react";
import Attendance from "./pages/user-view/attendance";
import Dashboard from "./pages/user-view/dashboard";
import Home from "./pages/common/Home";
import ResetPassword from "./pages/auth/reset-password";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminAttendance from "./pages/admin/adminAttendance";
import Overview from "./pages/admin/overview";
import Profile from "./pages/common/profile";
import Irregularities from "./pages/admin/irregularities";

function App() {
  const { isAuthenticated, role, isLoadingAuth } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastPath = sessionStorage.getItem("last_path");

    if (token) {
      dispatch(checkAuth(token)).then((res) => {
        // After auth is confirmed, redirect to stored path if safe
        if (
          lastPath &&
          lastPath !== "/" &&
          lastPath !== "/auth/login" &&
          !location.pathname.includes("dashboard") // avoid redirect loop
        ) {
          navigate(lastPath, { replace: true });
        }
      });
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("last_path", location.pathname);
  }, [location.pathname]);

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-tl overflow-x-hidden from-amber-100 to-cyan-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} role={role}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/employee"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} role={role}>
              <SystemLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="meal" element={<Meal />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="setting" element={<Profile />} />
          <Route path="day-wise-meal" element={<TodayMeals />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} role={role}>
              <SystemLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="overview" element={<Overview />} />
          <Route path="irregularities" element={<Irregularities />} />
          <Route path="meal" element={<Meal />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="setting" element={<Profile />} />
          <Route path="day-wise-meal" element={<TodayMeals />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
