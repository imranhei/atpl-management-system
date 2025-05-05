import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import bg from "../../assets/bg.jpg";
import { House } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full relative">
      <Link to="/" className="absolute sm:left-8 left-4 sm:top-8 top-6 z-50 flex items-center gap-2 text-black lg:text-white">
        <House size={20} strokeWidth={1.5} /><span>Home</span>
      </Link>
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 relative">
        <div className="absolute top-0 left-0 w-full h-full brightness-50 ">
          <img className="h-full w-full object-cover object-left" src={bg} alt="" />
        </div>
        <div className="max-w-lg space-y-6 text-center text-primary-foreground z-20">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome to ATPL Dhaka
          </h1>
          <h2 className="text-lg"></h2>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-10 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
