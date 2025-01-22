import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CommonForm from "../../components/common/form";
import { loginFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/use-toast";
import { login } from "@/store/auth-slice";

const initialState = {
  email: "",
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

    dispatch(login(formData)).then((res) => {
      console.log(res);
      if (res?.payload?.status) {
        toast({title: res.message || "Login successful",});
        navigate("/employee/attendance");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: res?.payload?.message || res?.error?.message || "",
        });
      }
    });
    return;
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-yellow-500">
      <div className="text-center">
        <h1 className="sm:text-3xl text-2xl font-bold tracking-tight text-primary">
          Sign in to ATPL Dhaka
        </h1>
        <p className="mt-2">
          Don&apos;t have an account?
          <Link
            className="font-medium ml-2 text-yellowDark hover:text-yellowDark hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
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
