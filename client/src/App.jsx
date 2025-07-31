import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { checkAuth } from "./store/auth-slice";

import AuthLayout from "./components/auth/layout";
import CheckAuth from "./components/common/check-auth";
import Layout from "./components/common/portfolio/Layout";
import SystemLayout from "./components/user-view/layout";
import AdminAttendance from "./pages/admin/adminAttendance";
import AdminDashboard from "./pages/admin/adminDashboard";
import ApplicationReview from "./pages/admin/applicationReview";
import Irregularities from "./pages/admin/irregularities";
import LeaveApplication from "./pages/admin/leaveApplication";
import LeaveSummary from "./pages/admin/leaveSummary";
import Overview from "./pages/admin/overview";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import ResetPassword from "./pages/auth/reset-password";
import Career from "./pages/common/Career";
import Chat from "./pages/common/Chat";
import Home from "./pages/common/Home";
import Profile from "./pages/common/profile";
import Attendance from "./pages/user-view/attendance";
import Dashboard from "./pages/user-view/dashboard";
import TodayMeals from "./pages/user-view/day-wise-meal";
import EmployeeLeave from "./pages/user-view/leave";
import Meal from "./pages/user-view/meal";

function App() {
  const { isAuthenticated, role, isLoadingAuth } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    dispatch(checkAuth(token));
  }, [dispatch]);

  // Save last attempted path for redirect after login
  useEffect(() => {
    const publicPaths = ["/", "/leave-review"];
    const isPublic = publicPaths.some((path) => location.pathname.startsWith(path));

    if (!isPublic) {
      sessionStorage.setItem("last_path", location.pathname);
    }
  }, [location.pathname]);

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-tl overflow-x-hidden from-amber-100 to-cyan-100 dark:from-zinc-900">
      <Routes>
        <Route path="/leave-review/:id" element={<ApplicationReview />} />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/career" element={<Career />} />

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} role={role}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
        </Route>
        <Route
          path="/employee"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} role={role} allowedRole="employee">
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
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} role={role} allowedRole="admin">
              <SystemLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="overview" element={<Overview />} />
          <Route path="irregularities" element={<Irregularities />} />
          <Route path="meal" element={<Meal />} />
          <Route path="leave-records" element={<LeaveSummary />} />
          <Route path="leave-application" element={<LeaveApplication />} />
          <Route path="application-review" element={<ApplicationReview />} />
          <Route path="setting" element={<Profile />} />
          <Route path="day-wise-meal" element={<TodayMeals />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="chat" element={<Chat />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
