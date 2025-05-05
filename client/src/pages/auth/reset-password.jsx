import React, { useState } from "react";
import CommonForm from "../../components/common/form";
import { resetPasswordFormControls } from "@/components/config";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hooks/use-toast";

const initialState = {
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
};

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
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
