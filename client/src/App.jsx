import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { checkAuth } from "./store/auth-slice";

import AuthLayout from "./components/auth/layout";
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
import ProtectedRoute from "./components/common/ProtectedRoute";
import GuestOnlyRoute from "./components/common/GuestOnlyRoute";

function App() {
  const { isAuthenticated, role, isLoadingAuth } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(checkAuth(token));
  }, [dispatch]);

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
        <Route path="/leave-review/:id" element={
          <ProtectedRoute 
            isAuthenticated={isAuthenticated}
            isLoadingAuth={isLoadingAuth}
            role={role} 
            publicAccess={true}
          >
            <ApplicationReview />
          </ProtectedRoute>
        } />
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
            <GuestOnlyRoute isAuthenticated={isAuthenticated} isLoadingAuth={isLoadingAuth} role={role}>
              <AuthLayout />
            </GuestOnlyRoute>
          }
        >
          <Route path="login" element={<AuthLogin />} />
        </Route>


        <Route
          path="/employee"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated}
              isLoadingAuth={isLoadingAuth}
              role={role} 
              allowedRoles={['employee']}
            >
              <SystemLayout />
            </ProtectedRoute>
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
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              role={role} 
              allowedRoles={['admin']}
            >
              <SystemLayout />
            </ProtectedRoute>
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
