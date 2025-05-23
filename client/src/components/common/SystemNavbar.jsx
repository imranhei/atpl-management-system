import React from "react";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
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
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const SystemNavbar = () => {
  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);
  console.log(theme)
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
    <header className="bg-blue-900 dark:bg-slate-800 dark:border-b dark:border-slate-900 flex items-center justify-between px-4 py-2 border-b shadow-md">
      <div className="flex justify-between flex-1 items-center gap-2">
        <div className="flex-1 lg:ml-0 ml-6">
          <Link to="/" className="flex w-fit justify-start items-center">
            <img
              src="/atpldhaka.png"
              className="lg:w-16 sm:w-14 w-12 lg:ml-0 ml-2"
            />
          </Link>
        </div>
        <div className="sm:px-4 px-2 py-0 hover:bg-transparent cursor-pointer" variant="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={20} color="#ffffff" /> : <Sun size={20} />}</div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-1 ring-white h-8 w-8 border-white">
              <AvatarImage
                src={
                  profile.profile_img
                    ? `https://djangoattendance.atpldhaka.com${profile.profile_img}`
                    : null
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                <img src={avatar2} alt="" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Notification</DropdownMenuItem>
            <DropdownMenuItem>
              <div onClick={handleLogout} className="flex items-center gap-2">
                <LogOut size={18} />
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
