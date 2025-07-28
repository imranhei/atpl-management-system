import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CommonForm from "../../components/common/form";
import { loginFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/use-toast";
import { login } from "@/store/auth-slice";

const initialState = {
  username: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const res = await dispatch(login(formData)); // ✅ Await is required
  
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          variant: "success",
          title: "Login successful",
        });
        localStorage.setItem("access_token", res.payload.access);
        // const role = res.payload.user.username === "frahman" || res.payload.user.username === "faisal";
        // navigate(`${role ? "/admin/dashboard" : "/employee/dashboard"}`);

      //   const lastPath = sessionStorage.getItem("last_path");

      // // check for redirect priority
      // if (
      //   lastPath &&
      //   lastPath !== "/" &&
      //   !lastPath.includes("/auth/login") &&
      //   !lastPath.includes("/auth/register")
      // ) {
      //   navigate(lastPath, { replace: true });
      // } else {
      //   const isAdmin =
      //     res.payload.user.username === "frahman" ||
      //     res.payload.user.username === "faisal";
      //   navigate(isAdmin ? "/admin/dashboard" : "/employee/dashboard");
      // }
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: res.payload?.message || "An unexpected error occurred.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message || "Unexpected error occurred",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="sm:text-3xl text-2xl font-bold tracking-tight text-primary">
          Sign in to ATPL Dhaka
        </h1>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        loadingText={"Signing In..."}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuthLogin;
