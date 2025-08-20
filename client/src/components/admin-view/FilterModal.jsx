import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployeeDetails } from "@/store/admin/employee-details-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Map for leave types (labels)
const typeMap = {
  full_day: "Full Day",
  "1st_half": "1st Half",
  "2nd_half": "2nd Half",
};

function displayName(p) {
  return (
    `${p?.first_name ?? ""} ${p?.last_name ?? ""}`.trim() ||
    p?.username ||
    p?.id ||
    "—"
  );
}

const FilterModal = ({
  children,
  params = { id: null, page: 1, per_page: 15, status: null, leave_type: null },
  setParams = () => {},
  role,
}) => {
  const dispatch = useDispatch();
  const { employeeDetails } = useSelector((s) => s.employeeDetails);

  // modal + combobox state
  const [open, setOpen] = useState(false);

  // local selections
  const [selectedEmp, setSelectedEmp] = useState(null); // whole person object
  const [status, setStatus] = useState(params.status ?? null); // "informed" | "uninformed" | null
  const [leaveType, setLeaveType] = useState(params.leave_type ?? null); // key of typeMap | null

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(getEmployeeDetails({ token }));
  }, [dispatch]);

  // Sync initial selected employee from params.id (id)
  useEffect(() => {
    if (!employeeDetails || !employeeDetails.length) return;
    if (!params?.id) {
      setSelectedEmp(null);
      return;
    }
    const found =
      employeeDetails.find((p) => String(p.id) === String(params.id)) ||
      employeeDetails.find((p) => String(p.id) === String(params.id));
    if (found) setSelectedEmp(found);
  }, [employeeDetails, params?.id]);

  const handleEmployeeChange = (person) => {
    setSelectedEmp(person);
  };

  const handleClear = () => {
    setSelectedEmp(null);
    setStatus(null);
    setLeaveType(null);
  };

  const handleApply = (e) => {
    e?.preventDefault?.();
    setParams((prev) => ({
      ...prev,
      // prefer id if available; fall back to id
      id: selectedEmp?.id || null,
      status: status || null,
      leave_type: leaveType || null,
      page: 1, // reset pagination when filters change
    }));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md w-5/6">
        <DialogHeader>
          <DialogTitle className="text-center">Filter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleApply} className="space-y-5 pt-2">
          {/* Employee */}
          {role === "admin" && (<div className="flex flex-col gap-2">
            <Label>Select Employee</Label>
            <Select
              value={selectedEmp?.id ? String(selectedEmp.id) : "all"}
              onValueChange={(val) => {
                if (val === "all") {
                  setSelectedEmp(null);
                } else {
                  const found = (employeeDetails ?? []).find(
                    (p) => String(p.id) === val
                  );
                  if (found) setSelectedEmp(found);
                }
              }}
            >
              <SelectTrigger className="w-full bg-sidebar">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent className="max-h-52 overflow-y-auto">
                <SelectItem value="all">All Employees</SelectItem>
                {(employeeDetails ?? []).map((person) => (
                  <SelectItem key={person.id} value={String(person.id)} isSelected={person.id === selectedEmp?.id}>
                    {displayName(person)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>)}

          {/* Status */}
          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select
              value={status ?? "all"}
              onValueChange={(v) => setStatus(v === "all" ? null : v)}
            >
              <SelectTrigger className="w-full bg-sidebar">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leave Type */}
          <div className="flex flex-col gap-2">
            <Label>Leave Type</Label>
            <Select
              value={leaveType ?? "all"}
              onValueChange={(v) => setLeaveType(v === "all" ? null : v)}
            >
              <SelectTrigger className="w-full bg-sidebar">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(typeMap).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
