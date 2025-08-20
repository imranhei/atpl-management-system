import { resetPasswordFormControls } from "@/components/config";
import { resetPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CommonForm from "../../components/common/Form";

const initialState = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast.error("Password Mismatch", {
        description: "New password and confirm password do not match.",
      });
      return;
    }

    dispatch(resetPassword(formData)).then((res) => {
      if (res.error) {
        toast.error("Error", {
          description:
            typeof res.payload === "string"
              ? res.payload
              : res.payload?.message || "Something went wrong",
        });
      } else {
        toast.success("Success", {
          description: "Password changed successfully.",
        });
        setFormData(initialState);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8 sm:px-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="sm:text-3xl text-2xl font-bold tracking-tight text-primary">
            Change Your Password
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter a new password below to change your password.
          </p>
        </div>
        <CommonForm
          formControls={resetPasswordFormControls}
          buttonText={"Change"}
          loadingText={"Changing..."}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
