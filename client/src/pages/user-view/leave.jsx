import LeaveApplicationTable from "@/components/admin-view/LeaveApplicationTable";
import LeaveForm from "@/components/admin-view/leaveForm";
import { useToast } from "@/hooks/use-toast";
import {
  addLeaveApplication,
  fetchLeaveApplicationList,
} from "@/store/leave/leave-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EmployeeLeave = () => {
  const dispatch = useDispatch();
  const { defaultLeaveData, leaveApplicationList, isLoading, error } =
    useSelector((state) => state.leaveApplication);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // emp_code: user?.emp_code || "",
    leave_date_from: "",
    leave_date_to: "",
    leave_type: "",
    reason: "",
  });

  useEffect(() => {
    dispatch(fetchLeaveApplicationList());
  }, [dispatch]);

  const handleSubmit = async (formData) => {
    console.log("Submitted formData:", formData);
    const convertedData = {
      leave_date_from: new Date(formData.leave_date_from)
        .toISOString()
        .split("T")[0],
      leave_date_to: new Date(formData.leave_date_to)
        .toISOString()
        .split("T")[0],
      leave_type: formData.leave_type.toLowerCase(),
      reason: formData.reason,
    };
    // if (user?.emp_code) {
    dispatch(addLeaveApplication(convertedData)).then((data) => {
      if (data?.payload?.success) {
        // Use "success" instead of "status"
        dispatch(fetchLeaveApplicationList());
      } else {
        console.log(data.payload);
        toast({ title: data?.payload?.message || "Error occurred" }); // Extract message
      }
    });

    setFormData({
      emp_code: user?.emp_code || "",
      leave_date_from: "",
      leave_date_to: "",
      leave_type: "",
      reason: "",
    });
    //   } else {
    //     toast({ title: "Employee code does't found, Please Login Again" });
    //   }
  };

  return (
    <div>
      <h1 className="text-lg font-semibold pb-2">Leave Application</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <LeaveForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />
          <LeaveApplicationTable data={leaveApplicationList} />
        </>
      )}
    </div>
  );
};

export default EmployeeLeave;
