import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import CheckAuth from "./components/common/check-auth";
import UserLayout from "./components/user-view/layout";
import Home from "./pages/user-view/home";
import { useDispatch, useSelector } from "react-redux";
// import { checkAuth } from "./store/auth-slice";

function App() {
  const { isAuthenticated, user, isLoadingAuth } = useSelector(
    (state) => state.auth
  );

  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-tl from-amber-100 to-cyan-100">
      <Routes>
        hello
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Home />} />
          {/* <Route path="contact" element={<Contact />} /> */}
        </Route>
      </Routes>
    </div>
  )
}

export default App
