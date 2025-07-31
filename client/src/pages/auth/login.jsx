import { loginFormControls } from "@/components/config";
import { login } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/form";
import { useToast } from "../../hooks/use-toast";

const initialState = {
  username: "",
  password: "",
};

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, role, isLoading } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState(initialState);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await dispatch(login(formData)); // Await is required

      if (res.meta.requestStatus === "fulfilled") {
        const user = res.payload.user; // Assume payload = { access, user: { role, ... } }

        toast({
          variant: "success",
          title: "Login successful",
        });

        localStorage.setItem("access_token", res.payload.access);

        const lastPath = sessionStorage.getItem("last_path");

        if (
          lastPath &&
          lastPath !== "/" &&
          !lastPath.includes("/auth/login") &&
          !lastPath.includes("/auth/register")
        ) {
          sessionStorage.removeItem("last_path"); // Optional: clean up
          navigate(lastPath, { replace: true });
        } else {
          // Navigate based on role
          if (user?.username === "frahman" || user?.username === "faisal") {
            navigate("/admin/dashboard");
          } else {
            navigate("/employee/dashboard");
          }
        }
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

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    }
  }, [isAuthenticated, role, navigate]);

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
