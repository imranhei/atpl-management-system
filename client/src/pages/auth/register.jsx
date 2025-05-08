import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CommonForm from "../../components/common/form";
import { registerFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "../../hooks/use-toast"

const initialState = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const AuthResgister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const {toast} = useToast();

  const onSubmit = (event) => {
    event.preventDefault();

    //form validation
    // if(formData.password !== formData.password_confirmation) {
    //   toast({
    //     variant: "destructive",
    //     title: "Password and confirm password does not match",
    //   });
    //   return;
    // }

    // //email validation
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(formData.email)) {
    //   toast({
    //     variant: "destructive",
    //     title: "Invalid email address",
    //   });
    //   return;
    // }

    // //all fields are required
    // if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
    //   toast({
    //     variant: "destructive",
    //     title: "All fields are required",
    //   });
    //   return;
    // }

    // //minimum password length check
    // if (formData.password.length < 6) {
    //   toast({
    //     variant: "destructive",
    //     title: "Password must be at least 6 characters",
    //   });
    //   return;
    // }

    // dispatch(registerUser(formData)).then((data) => {
    //   if (data?.payload && data?.payload?.status) {
    //     toast({
    //       title: data.payload.message || "Registration success",
    //     });
    //     navigate("/auth/login");
    //   } else {
    //     toast({
    //       variant: "destructive",
    //       description: data?.payload?.message || data?.error?.message || "",
    //       title:  "Registration failed",
    //     });
    //   }
    // });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="sm:text-3xl text-2xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-yellowDark hover:text-yellowDark hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm 
        formControls={registerFormControls}
        buttonText={'Sign Up'}
        loadingText={"Signing Up..."}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuthResgister;
