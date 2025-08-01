import { useState } from "react";
import CommonForm from "../../components/common/form";
import { registerFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "../../hooks/use-toast";

const initialState = {
  emp_code: "",
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

const AuthResgister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("formData", formData);

    // //all fields are required
    if (Object.values(formData).some(value => !value)) {
      toast({
        variant: "destructive",
        title: "All fields are required",
      });
      return;
    }

    // //minimum password length check
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password must be at least 6 characters",
      });
      return;
    }

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload && data?.payload?.status) {
        toast({
          title: data.payload.message || "Registration success",
        });
        setFormData(initialState);
      } else {
        toast({
          variant: "destructive",
          description: data?.payload?.message || data?.error?.message || "",
          title:  "Registration failed",
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8 sm:px-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="sm:text-3xl text-2xl font-bold tracking-tight text-foreground">
            Add New User
          </h1>
        </div>
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Register"}
          loadingText={"Registering..."}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AuthResgister;
