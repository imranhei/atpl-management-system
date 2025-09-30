import { loginFormControls } from "@/components/config";
import { login } from "@/store/auth-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CommonForm from "../../components/common/Form";

const initialState = {
  username: "",
  password: "",
};

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, isLoading } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState(initialState);

  const lastPath = sessionStorage.getItem("last_path");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await dispatch(login(formData));

      if (res.meta.requestStatus === "fulfilled") {
        const user = res.payload.user;
        localStorage.setItem("access_token", res.payload.access);

        // Check for stored path first
        const pathSources = {
          sessionStorage: sessionStorage.getItem("last_path"),
          localStorage: localStorage.getItem("last_path_fallback"),
          locationState: location.state?.from,
        };

        const redirectPath =
          pathSources.sessionStorage ||
          pathSources.locationState ||
          pathSources.localStorage ||
          null;

        // Only redirect to stored path if it's a leave-review page
        sessionStorage.removeItem("last_path");
        localStorage.removeItem("last_path_fallback");

        // Redirect logic
        if (redirectPath && redirectPath.startsWith("/leave-review/")) {
          navigate(redirectPath, { replace: true });
        } else {
          navigate(
            user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard",
            { replace: true }
          );
        }
        toast.success("Login successful");
      } else {
        toast.error("Login failed", {
          description: res.payload.message || "Unexpected error occurred",
        });
      }
    } catch (err) {
      toast.error("Login failed", {
        description: err.message || "Unexpected error occurred",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fromPath = location.state?.from;
      const defaultPath =
        role === "admin" ? "/admin/dashboard" : "/employee/dashboard";

      navigate(fromPath || defaultPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location.state]);

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
