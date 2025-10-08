import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CommonForm from "../common/Form";
import { registerFormControls } from "../config";

const initialState = {
  emp_code: "",
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

const AddEmployeeModal = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialState);
  const [open, setOpen] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();

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
        setOpen(false);
      } else {
        toast.error("Registration failed", {
          description: data?.payload?.message || data?.error?.message || "",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-5/6 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center mb-4">
            Register New Employee
          </DialogTitle>
        </DialogHeader>
        <CommonForm
          formControls={registerFormControls}
          buttonText={"Register"}
          loadingText={"Registering..."}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
