import { Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import bg from "../../assets/food.webp";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 relative">
        <div className="absolute top-0 left-0 w-full h-full brightness-50 ">
          <img className="h-full w-full object-cover" src={bg} alt="" />
        </div>
        <div className="max-w-lg space-y-6 text-center text-primary-foreground z-20">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome to ATPL Meal Management System
          </h1>
          <h2 className="text-lg"></h2>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
