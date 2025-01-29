import React from "react";
import { Button } from "@/components/ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import { useNavigate, Link } from "react-router-dom";

const EmployeeHeader = ({ setOpenSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // dispatch(logoutUser()); //if i have any subdomain
    dispatch(resetTokenAndCredentials()); //if i don't have any subdomain
    navigate("/");
  };

  return (
    <header className="bg-blue-900 flex items-center justify-between px-4 py-2 border-b shadow-md">
      <div className="flex justify-between flex-1 items-center">
      <Button
        onClick={() => setOpenSidebar(true)}
        className="lg:hidden sm:block px-2 sm:px-4 h-8 sm:h-10 text-amber-300"
        variant="white"
      >
        <AlignJustify size={20} />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <Link to="/" className="flex flex-1 justify-start items-center">
        <img src="/atpldhaka.png" className="lg:w-16 sm:w-14 w-12 lg:ml-0 ml-2" />
        {/* <span className="font-bold text-lg text-violet-800 sm:block hidden">
          ATPL Dhaka
        </span> */}
      </Link>
      {/* <div className="flex flex-1 justify-end"> */}
        <Button
          onClick={handleLogout}
          className="inline-flex lg:gap-2 sm:gap-1 items-center py-2 sm:text-sm text-xs font-medium px-3 sm:px-4 h-8 sm:h-10 text-amber-300"
          variant="white"
        >
          <LogOut size={20} />
          <span className="sm:block hidden">Log Out</span>
        </Button>
      </div>
    </header>
  );
};

export default EmployeeHeader;
