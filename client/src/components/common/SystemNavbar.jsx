import React from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth-slice";
import { useNavigate, Link } from "react-router-dom";
import avatar2 from "/avatar2.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SystemNavbar = ({ setOpenSidebar }) => {
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-1 ring-white  h-8 w-8 border-white">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback><img src={avatar2} alt="" /></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Notification</DropdownMenuItem>
            <DropdownMenuItem>
              <div
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default SystemNavbar;
