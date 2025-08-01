import { registerFormControls } from "@/components/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CommonForm from "../../components/common/form";
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

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("formData", formData);

    // //all fields are required
    if (Object.values(formData).some((value) => !value)) {
      toast.success("All fields are required");
      return;
    }

    // //minimum password length check
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload && data?.payload?.status) {
        toast.success(data.payload.message || "Registration success");
        setFormData(initialState);
      } else {
        toast.error("Registration failed", {
          description: data?.payload?.message || data?.error?.message || "",
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
