import React, { useState } from "react";
import CommonForm from "../../components/common/form";
import { resetPasswordFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/use-toast";
import { resetPassword } from "@/store/auth-slice";

const initialState = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    dispatch(resetPassword(formData)).then((res) => {
      if (res.error) {
        toast({
          title: "Error",
          description:
            typeof res.payload === "string"
              ? res.payload
              : res.payload?.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password changed successfully.",
          variant: "default",
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
