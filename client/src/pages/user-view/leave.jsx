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
    const formatDateUTC = (date) => {
      const d = new Date(date);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
    };

    const convertedData = {
      leave_date_from: formatDateUTC(formData.leave_date_from),
      leave_date_to: formatDateUTC(formData.leave_date_to),
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
    <div className="m-4 sm:space-y-4 space-y-3">
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
