import LeaveApplicationTable from "@/components/admin-view/LeaveApplicationTable";
import LeaveForm from "@/components/admin-view/leaveForm";
import { addLeaveApplication } from "@/store/leave/leave-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialState = {
  leave_type: "full_day",
  reason: "",
  date: "",
  start_date: "",
  end_date: "",
};

const EmployeeLeave = () => {
  const dispatch = useDispatch();
  const { defaultLeaveData, leaveApplicationList, isLoading, error } =
    useSelector((state) => state.leaveApplication);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    // dispatch(fetchLeaveApplicationList());
  }, [dispatch]);

  const handleClearForm = () => {
    setFormData(initialState);
  };

  const handleSubmit = async (formData) => {
    // optionally clean up: remove empty keys
    const cleaned = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v)
    );

    dispatch(addLeaveApplication(cleaned)).then((res) => {
      if (res.error) {
        toast.error("Error", {
          description:
            typeof res.payload === "string"
              ? res.payload
              : res.payload?.message || "Something went wrong",
        });
      } else {
        toast.success("Success", {
          description: "Leave application submitted successfully.",
        });
      }

      setFormData(initialState);
    });
  };

  return (
    <div className="m-4 sm:space-y-4 space-y-3">
      <LeaveForm
        formData={formData}
        setFormData={setFormData}
        onClearForm={handleClearForm}
        onSubmit={handleSubmit}
      />
      <LeaveApplicationTable data={leaveApplicationList} />
    </div>
  );
};

export default EmployeeLeave;
