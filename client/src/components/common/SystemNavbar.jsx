import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/auth-slice";
import { LogOut, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import avatar2 from "/avatar2.png";

const SystemNavbar = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);

  const BASE = "https://djangoattendance.atpldhaka.com";

  const imgPath = profile?.profile_img;
  const hasImg = imgPath && imgPath !== "null" && imgPath !== "/null";

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
    <header className="bg-navbar border-b border-navbar-border flex items-center justify-between px-4 py-2 shadow-xl">
      <div className="flex justify-between flex-1 items-center gap-2">
        <div className="flex-1 lg:ml-0 ml-6">
          <Link to="/" className="flex w-fit justify-start items-center">
            <img
              src="/atpldhaka.png"
              className="lg:w-16 sm:w-14 w-12 lg:ml-0 ml-2"
            />
          </Link>
        </div>
        <div
          className="sm:px-4 px-2 py-0 hover:bg-transparent cursor-pointer"
          variant="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon size={20} color="#ffffff" />
          ) : (
            <Sun size={20} />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-1 ring-white h-8 w-8 border-white">
              <AvatarImage
                src={hasImg ? new URL(imgPath, BASE).href : undefined}
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
