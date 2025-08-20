import LeaveForm from "@/components/admin-view/LeaveForm";
import PaginationWithEllipsis from "@/components/user-view/PaginationWithEllipsis";
import {
  addLeaveApplication,
  fetchLeaveApplicationList,
} from "@/store/leave/leave-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ApplicationHistory from "../admin/ApplicationHistory";

const initialState = {
  leave_type: "full_day",
  reason: "",
  date: [], // always array of 'yyyy-MM-dd'
};

const EmployeeLeave = () => {
  const dispatch = useDispatch();
  const { leaveApplicationList, pagination, isLoading, isSubmiting } =
    useSelector((state) => state.leaveApplication);
  const [formData, setFormData] = useState(initialState);
  const [params, setParams] = useState({
    page: 1,
    per_page: 15,
  });

  const handleClearForm = () => setFormData(initialState);

  const handleSubmit = async (data) => {
    if (!Array.isArray(data.date) || data.date.length === 0) {
      toast.error("Please select at least one date.");
      return;
    }

    // Require reason for all types (dropdown for full, textarea for half)
    if (!data.reason || String(data.reason).trim() === "") {
      toast.error("Please provide a reason.");
      return;
    }

    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => !(v === "" || v == null))
    );

    dispatch(addLeaveApplication(cleaned)).then((res) => {
      if (res.error) {
        toast.error(res?.error?.message, {
          description:
            typeof res.payload === "string"
              ? res.payload
              : res.payload?.message || "Something went wrong",
        });
      } else {
        toast.success("Success", {
          description: "Leave application submitted successfully.",
        });
        setFormData(initialState);
      }
    });
  };

  // const handlePerPageChange = (value) => {
  //   setParams((prev) => ({ ...prev, page: 1, per_page: parseInt(value) }));
  // };

  const handlePageChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    dispatch(fetchLeaveApplicationList(params));
  }, [params]);

  return (
    <div className="m-4 sm:space-y-4 space-y-3">
      <LeaveForm
        formData={formData}
        setFormData={setFormData}
        onClearForm={handleClearForm}
        onSubmit={handleSubmit}
        isLoading={isSubmiting}
      />
      <ApplicationHistory
        data={leaveApplicationList}
        isLoading={isLoading}
      />
      {pagination?.last_page > 1 && (
        <PaginationWithEllipsis
          currentPage={params.page}
          totalPages={pagination?.last_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EmployeeLeave;
