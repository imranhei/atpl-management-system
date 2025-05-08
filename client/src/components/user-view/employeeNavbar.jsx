import React from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth-slice";
import { useNavigate, Link } from "react-router-dom";

const EmployeeNavbar = ({ setOpenSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        localStorage.removeItem("access_token");
        navigate("/");
      } else {
        console.error("Logout failed:", res.payload);
      }
    });
  };

  return (
    <header className="bg-blue-900 flex items-center justify-between px-4 py-2 border-b shadow-md">
      <div className="flex justify-between flex-1 items-center">
        <div
          onClick={() => setOpenSidebar(true)}
          className="lg:hidden sm:block px-2 sm:px-4 text-amber-300"
        >
          <AlignJustify size={20} />
          <span className="sr-only">Toggle Menu</span>
        </div>
        <div className="flex-1">
          <Link to="/" className="flex w-fit justify-start items-center">
            <img
              src="/atpldhaka.png"
              className="lg:w-16 sm:w-14 w-12 lg:ml-0 ml-2"
            />
          </Link>
        </div>
        <div
          onClick={handleLogout}
          className="inline-flex lg:gap-2 sm:gap-1 items-center py-2 sm:text-sm text-xs font-medium px-3 sm:px-4 text-amber-300 cursor-pointer"
        >
          <LogOut size={20} />
          <span className="sm:block hidden">Log Out</span>
        </div>
      </div>
    </header>
  );
};

export default EmployeeNavbar;
