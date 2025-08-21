import CalendarDropdown from "@/components/common/CalendarDropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployeeDetails } from "@/store/admin/employee-details-slice";
import { fetchLeaveSummary, ManuallyAddLeave } from "@/store/leave/leave-slice";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const initialFormData = {
  user_id: null,
  leave_type: "",
  date: [],
  reason: "",
  status: "approved",
};

const reasons = [
  { value: "personal", label: "Personal Leave" },
  { value: "family", label: "Family Issue" },
  { value: "sick", label: "Sick Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "wedding", label: "Wedding Leave" },
];

function displayName(p) {
  return (
    `${p?.first_name ?? ""} ${p?.last_name ?? ""}`.trim() ||
    p?.username ||
    p?.id ||
    "—"
  );
}

const typeMap = {
  full_day: "Full Day",
  "1st_half": "1st Half (7am - 11:30am)",
  "2nd_half": "2nd Half (11:30am - 4pm)",
};

const AddLeaveModal = ({ children }) => {
  const dispatch = useDispatch();
  const { employeeDetails } = useSelector((s) => s.employeeDetails);
  const { isLoading } = useSelector((s) => s.leaveApplication);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleApply = (e) => {
    e.preventDefault();

    if (!formData.user_id) {
      toast.error("Employee is required");
      return;
    }
    if (!formData.leave_type) {
      toast.error("Leave type is required");
      return;
    }
    if (!formData.date || formData.date.length === 0) {
      toast.error("Date is required");
      return;
    }
    if (!formData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    dispatch(ManuallyAddLeave(formData)).then((res) => {
      if (res.payload.data) {
        toast.success("Leave applied successfully");
        dispatch(fetchLeaveSummary());
        handleClear();
        setOpen(false);
      } else {
        toast.error("Error applying leave");
      }
    });
  };

  const isFullDay = formData.leave_type === "full_day";

  const handleEmployeeChange = (person) => {
    setFormData((prev) => ({ ...prev, user_id: person.id }));
    setSelectedEmp(person);
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setSelectedEmp(null);
    setSelectedDates([]);
  };

  const removeOne = (dateToRemove) => {
    const next = selectedDates.filter(
      (d) => format(d, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
    );
    setSelectedDates(next);
    setFormData((prev) => ({
      ...prev,
      date: next.map((d) => format(d, "yyyy-MM-dd")), // ✅ array
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(getEmployeeDetails({ token }));
  }, [dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-5/6">
        <DialogHeader>
          <DialogTitle className="text-center">Add Leave Manually</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleApply} className="space-y-5 pt-2">
          <div className="flex flex-col gap-2">
            <Label>
              Select Employee <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedEmp?.id?.toString() ?? ""}
              onValueChange={(val) => {
                const emp = employeeDetails.find(
                  (e) => e.id.toString() === val
                );
                if (emp) {
                  handleEmployeeChange(emp);
                } else {
                  // clear when no value
                  setFormData((prev) => ({ ...prev, user_id: null }));
                  setSelectedEmp(null);
                }
              }}
            >
              <SelectTrigger className="w-full bg-sidebar font-normal">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto">
                {employeeDetails?.map((person) => (
                  <SelectItem key={person.id} value={person.id.toString()}>
                    {displayName(person)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Leave Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.leave_type}
              onValueChange={(val) => {
                setFormData((prev) => ({ ...prev, leave_type: val }));
              }}
            >
              <SelectTrigger className="bg-sidebar">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(typeMap).map((key) => (
                  <SelectItem key={key} value={key}>
                    {typeMap[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date(s) — ALWAYS multiple selection, submit as array */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>
              Date(s) <span className="text-red-500">*</span>
            </Label>
            <CalendarDropdown
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              setFormData={setFormData}
            />

            {!!selectedDates.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {[...selectedDates]
                  .sort((a, b) => a - b)
                  .map((d) => (
                    <span
                      key={format(d, "yyyy-MM-dd")}
                      className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-background"
                    >
                      {format(d, "LLL dd, y")}
                      <button
                        type="button"
                        className="ml-1 hover:opacity-70"
                        onClick={() => removeOne(d)}
                        aria-label="Remove date"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Leave Reason <span className="text-red-500">*</span>
            </Label>
            {isFullDay ? (
              <Select
                value={formData.reason}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, reason: value }))
                }
              >
                <SelectTrigger className="flex-1 bg-sidebar">
                  <SelectValue placeholder="Select Leave Reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Textarea
                placeholder="Reason"
                value={formData.reason}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, reason: e.target.value }));
                }}
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleClear}
              className="flex-1 !bg-rose-400 hover:!bg-rose-500"
            >
              Clear
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveModal;
