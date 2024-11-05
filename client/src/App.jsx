import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import CheckAuth from "./components/common/check-auth";
import UserLayout from "./components/user-view/layout";
import Home from "./pages/user-view/home";
import Meal from "./pages/user-view/meal";
import EmployeeLeave from "./pages/user-view/leave";
import EmployeeSetting from "./pages/user-view/setting";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { LoaderCircle } from "lucide-react";
// import { checkAuth } from "./store/auth-slice";

function App() {
  const { isAuthenticated, user, isLoadingAuth } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token"); //if i don't have any subdomain pass this token
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        dispatch(checkAuth(parsedToken));
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    } else {
      console.warn("No token found in sessionStorage");
    }
  }, [dispatch]);

  if (isLoadingAuth) {
    return (
      // <div className="flex items-center justify-center min-w-screen min-h-screen">
      //   <div className="flex flex-col space-y-3">
      //     <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      //     <div className="space-y-2">
      //       <Skeleton className="h-4 w-[250px]" />
      //       <Skeleton className="h-4 w-[200px]" />
      //     </div>
      //   </div>
      // </div>
      <div className="flex items-center justify-center min-w-screen min-h-screen">
        <LoaderCircle size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-tl from-amber-100 to-cyan-100">
      <Routes>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
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
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<Home />} />
          <Route path="meal" element={<Meal />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="setting" element={<EmployeeSetting />} />
          {/* <Route path="contact" element={<Contact />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
