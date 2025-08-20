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
import { format } from "date-fns";
import { Calendar1Icon, Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";

const initialFormData = {
  user_id: null,
  leave_type: "",
  date: [],
  reason: "",
  status: "",
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
  "1st_half": "1st Half",
  "2nd_half": "2nd Half",
};

const AddLeaveModal = ({ children }) => {
  const dispatch = useDispatch();
  const triggerRef = useRef(null);
  const triggerCalRef = useRef(null);
  const { employeeDetails } = useSelector((s) => s.employeeDetails);
  const { isLoading } = useSelector((s) => s.leaveApplication);
  const [open, setOpen] = useState(false);
  const [openCal, setOpenCal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [empListOpen, setEmpListOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [side, setSide] = useState("bottom");
  const [selectedDates, setSelectedDates] = useState([]);

  const CAL_HEIGHT = 350;

  const handleApply = (e) => {
    e.preventDefault();
    console.log(formData);

    // dispatch(
    //   ManuallyAddLeave({
    //     ...formData,
    //     date: selectedDates.map((d) => format(d, "yyyy-MM-dd")).join(","),
    //   })
    // );
    setOpen(false);
  };

  const handleEmployeeChange = (person) => {
    setFormData((prev) => ({ ...prev, user_id: person.id }));
    setSelectedEmp(person);
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  const prettySummary = useMemo(() => {
    if (!formData.date.length) return "Pick date(s)";
    if (formData.date.length === 1)
      return format(formData.date[0], "LLL dd, y");
    const sorted = [...formData.date].sort((a, b) => a - b);
    return `${format(sorted[0], "LLL dd, y")} (+${sorted.length - 1})`;
  }, [formData.date]);

  const removeOne = (dateToRemove) => {
    const next = selectedDates.filter(
      (d) => format(d, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
    );
    setSelectedDates(next);
    setFormData((prev) => ({
      ...prev,
      date: next.map((d) => format(d, "yyyy-MM-dd")),
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
          <DialogTitle className="text-center">Filter</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleApply} className="space-y-5 pt-2">
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

              <PopoverContent
                side="bottom"
                align="start"
                className="min-w-[200px] p-0"
                // ✅ prevent Radix from closing when scrolling/clicking inside
                // onInteractOutside={(e) => {
                //   if (
                //     e.target.closest("[cmdk-list]") ||
                //     e.target.closest("[cmdk-input-wrapper]")
                //   ) {
                //     e.preventDefault();
                //   }
                // }}
              >
                <Command>
                  <CommandInput placeholder="Search name..." />
                  <CommandList
                    className="max-h-44 overflow-y-auto"
                    onPointerDown={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
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

          <div className="flex flex-col gap-2">
            <Label>Leave Type</Label>
            <Select
              onValueChange={(e) => {
                setFormData({ ...formData, leave_type: e });
              }}
            >
              <SelectTrigger>
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
            <Label>Date(s):</Label>
            <Popover
              open={openCal}
              onOpenChange={(o) => {
                setOpenCal(o);
                if (o && triggerCalRef.current) {
                  const rect = triggerCalRef.current.getBoundingClientRect();
                  const spaceBelow = window.innerHeight - rect.bottom;
                  setSide(spaceBelow < CAL_HEIGHT ? "top" : "bottom");
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  ref={triggerCalRef}
                  type="button"
                  className={cn(
                    "justify-start font-normal bg-sidebar shadow-none border hover:bg-gray-100",
                    !selectedDates.length && "text-muted-foreground"
                  )}
                >
                  <Calendar1Icon className="mr-2 inline-block" />
                  {prettySummary}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                side={side} // flips to top when needed
                align="start"
                sideOffset={8}
                collisionPadding={12} // keeps edges away from viewport
                className="w-auto p-0 z-50 max-h-[min(370px,calc(100vh-96px))] overflow-auto"
              >
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => {
                    const safe = dates ?? [];
                    setSelectedDates(safe);
                    setFormData((prev) => ({
                      ...prev,
                      date: safe.map((d) => format(d, "yyyy-MM-dd")),
                    }));
                  }}
                  footer={
                    <div className="flex items-center justify-between gap-2 border-t sticky bottom-0 bg-background">
                      <Button
                        type="button"
                        variant="ghost"
                        className="p-1"
                        onClick={() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          setSelectedDates((prev) => {
                            const exists = prev.some(
                              (d) => d.toDateString() === today.toDateString()
                            );
                            const next = exists ? prev : [...prev, today];
                            setFormData((f) => ({
                              ...f,
                              date: next.map((d) => format(d, "yyyy-MM-dd")),
                            }));
                            return next;
                          });
                        }}
                      >
                        Today
                      </Button>
                      <Button
                        className="p-1"
                        type="button"
                        variant="ghost"
                        onClick={() => setOpenCal(false)}
                      >
                        OK
                      </Button>
                    </div>
                  }
                />
              </PopoverContent>
            </Popover>

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
            <Label>Leave Reason:</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reason: value }))
              }
            >
              <SelectTrigger className="flex-1">
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
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleClear}
              className="flex-1"
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
