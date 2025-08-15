import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getEmployeeDetails } from "@/store/admin/employee-details-slice";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
}) => {
  const dispatch = useDispatch();
  const triggerRef = useRef(null);
  const { employeeDetails } = useSelector((s) => s.employeeDetails);

  // modal + combobox state
  const [open, setOpen] = useState(false);
  const [empListOpen, setEmpListOpen] = useState(false);

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
          <div className="flex flex-col gap-2">
            <Label>Select Employee</Label>
            <Popover open={empListOpen} onOpenChange={setEmpListOpen}>
              <PopoverTrigger asChild>
                <Button
                  ref={triggerRef}
                  type="button"
                  variant="outline"
                  aria-expanded={empListOpen}
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal overflow-hidden bg-sidebar",
                    !selectedEmp && "text-muted-foreground"
                  )}
                >
                  {selectedEmp ? displayName(selectedEmp) : "Select Employee"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search name..." />
                  <CommandList
                    className="max-h-44 overflow-y-auto"
                    onWheelCapture={(e) => e.stopPropagation()}
                    onTouchMoveCapture={(e) => e.stopPropagation()}
                  >
                    <CommandEmpty>No employee found.</CommandEmpty>
                    <CommandGroup>
                      {(employeeDetails ?? []).map((person) => (
                        <CommandItem
                          key={person.id}
                          value={displayName(person)}
                          onSelect={() => {
                            handleEmployeeChange(person);
                            setEmpListOpen(false);
                            triggerRef.current?.focus();
                          }}
                        >
                          {displayName(person)}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedEmp?.id === person.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

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
