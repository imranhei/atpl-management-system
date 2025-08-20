import { Button } from "@/components/ui/button";
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
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";

const LeaveForm = ({
  formData,
  setFormData,
  onClearForm,
  onSubmit,
  isLoading,
}) => {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]); // Date[]
  const [side, setSide] = useState("bottom"); // will switch to 'top' if needed
  const CAL_HEIGHT = 350;

  // keep local state in sync if parent resets
  useEffect(() => {
    if (!Array.isArray(formData?.date) || formData.date.length === 0) {
      setSelectedDates([]);
    }
  }, [formData?.date]);

  const reasons = [
    { value: "personal", label: "Personal Leave" },
    { value: "family", label: "Family Issue" },
    { value: "sick", label: "Sick Leave" },
    { value: "paternity", label: "Paternity Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "wedding", label: "Wedding Leave" },
  ];

  const isFullDay = formData.leave_type === "full_day";

  const prettySummary = useMemo(() => {
    if (!selectedDates.length) return "Pick date(s)";
    if (selectedDates.length === 1)
      return format(selectedDates[0], "LLL dd, y");
    const sorted = [...selectedDates].sort((a, b) => a - b);
    return `${format(sorted[0], "LLL dd, y")} (+${sorted.length - 1})`;
  }, [selectedDates]);

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

  return (
    <form
      className="space-y-4 py-6 bg-container rounded shadow-spread border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <h1 className="text-lg font-bold pb-2 text-textHead text-center">
        Apply Leave
      </h1>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {/* Leave Type */}
        <div className="flex flex-col gap-2">
          <Label>Leave Type:</Label>
          <Select
            value={formData.leave_type}
            onValueChange={(value) => {
              // Keep dates; just reset reason when switching modes to avoid mixing dropdown code & free text
              setFormData((prev) => ({
                ...prev,
                leave_type: value,
                reason: "",
              }));
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_day">Full day</SelectItem>
              <SelectItem value="1st_half">1st half (7am - 11:30am)</SelectItem>
              <SelectItem value="2nd_half">2nd half (11:30am - 4pm)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reason (conditional) */}
        {isFullDay ? (
          // FULL DAY → dropdown
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
        ) : (
          // HALF DAY → textarea
          <div className="flex flex-col gap-2">
            <Label>Reason:</Label>
            <Textarea
              placeholder="Write your reason"
              className="w-full min-h-20"
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
          </div>
        )}

        {/* Date(s) — ALWAYS multiple selection, submit as array */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label>Date(s):</Label>
          <Popover
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (o && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setSide(spaceBelow < CAL_HEIGHT ? "top" : "bottom");
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                ref={triggerRef}
                type="button"
                className={cn(
                  "justify-start font-normal bg-sidebar shadow-none border hover:bg-gray-100",
                  !selectedDates.length && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 inline-block" />
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
                      onClick={() => setOpen(false)}
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="reset"
          className="w-full bg-gray-100 hover:bg-gray-200"
          onClick={() => {
            onClearForm();
            setSelectedDates([]);
          }}
        >
          Clear
        </Button>
        <Button type="submit" className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 animate-spin" /> Submitting
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LeaveForm;
