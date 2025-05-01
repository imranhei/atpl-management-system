import React from "react";
import { Button } from "@/components/ui/button";
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
    <header className="bg-blue-900 flex items-center justify-between px-4 py-1 border-b shadow-md">
      <div className="flex justify-between flex-1 items-center">
        <Button
          onClick={() => setOpenSidebar(true)}
          className="lg:hidden sm:block px-2 sm:px-4 h-10 sm:h-12 text-amber-300"
          variant="white"
        >
          <AlignJustify size={24} />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link to="/" className="flex flex-1 justify-start items-center">
          <img
            src="/atpldhaka.png"
            className="lg:w-16 sm:w-14 w-12 lg:ml-0 ml-2"
          />
        </Link>
        <Button
          onClick={handleLogout}
          className="inline-flex lg:gap-2 sm:gap-1 items-center py-2 sm:text-sm text-xs font-medium px-3 sm:px-4 h-10 sm:h-12 text-amber-300"
          variant="white"
        >
          <LogOut size={24} />
          <span className="sm:block hidden">Log Out</span>
        </Button>
      </div>
    </header>
  );
};

export default EmployeeNavbar;
