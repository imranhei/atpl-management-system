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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";

const LeaveForm = ({ formData, setFormData, onClearForm, onSubmit }) => {
  const { isLoading } = useSelector((state) => state.leaveApplication);
  const [rangeDate, setRangeDate] = useState({ from: null, to: null });
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const reasons = [
    { value: "personal", label: "Personal Leave" },
    { value: "family", label: "Family Issue" },
    { value: "sick", label: "Sick Leave" },
  ];

  return (
    <form
      className="space-y-4 py-6 bg-container rounded shadow-spread border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <h1 className="text-lg font-bold pb-6 text-textHead text-center">
        Apply Leave
      </h1>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        {/* Leave Type */}
        <div className="flex flex-col gap-2">
          <Label>Leave Type:</Label>
          <Select
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                leave_type: value,
                date: "",
                start_date: "",
                end_date: "",
                reason: "",
              }));
              setRangeDate({ from: null, to: null }); // reset date selection
            }}
            value={formData.leave_type}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent>
              {[
                { label: "Full", value: "full_day" },
                { label: "Half", value: "half_day" },
              ].map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Leave Reason */}
        {formData.leave_type === "full_day" && (
          <div className="flex flex-col gap-2">
            <Label>Leave Reason:</Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reason: value }))
              }
              value={formData.reason}
              disabled={formData.leave_type === "half_day"}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Leave Reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((rea) => (
                  <SelectItem key={rea.value} value={rea.value}>
                    {rea.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Selection */}
        {/* From Date */}
        <div className="flex flex-col gap-2">
          <Label>
            {formData.leave_type === "half_day" ? "Date:" : "From:"}
          </Label>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "justify-start font-normal bg-sidebar shadow-none border hover:bg-gray-100",
                  !rangeDate?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 inline-block" />
                {rangeDate?.from
                  ? format(rangeDate.from, "LLL dd, y")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rangeDate.from}
                onSelect={(date) => {
                  setRangeDate((prev) => ({ ...prev, from: date }));

                  if (formData.leave_type === "half_day") {
                    setFormData((prev) => ({
                      ...prev,
                      date: format(date, "yyyy-MM-dd"),
                      start_date: "",
                      end_date: "",
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      date: format(date, "yyyy-MM-dd"),
                    }));
                  }
                  setFromOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        {formData.leave_type === "full_day" && (
          <div className="flex flex-col gap-2">
            <Label>To:</Label>
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={!rangeDate.from}
                  className={cn(
                    "justify-start font-normal bg-sidebar shadow-none border hover:bg-gray-100",
                    !rangeDate?.to && "text-muted-foreground",
                    !rangeDate.from && "cursor-not-allowed opacity-50"
                  )}
                >
                  <CalendarIcon className="mr-2 inline-block" />
                  {rangeDate?.to
                    ? format(rangeDate.to, "LLL dd, y")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={rangeDate.to}
                  onSelect={(date) => {
                    setRangeDate((prev) => ({ ...prev, to: date }));

                    if (rangeDate.from && date) {
                      const start = format(rangeDate.from, "yyyy-MM-dd");
                      setFormData((prev) => ({
                        ...prev,
                        date: "",
                        start_date: start,
                        end_date: format(date, "yyyy-MM-dd"),
                      }));
                    }

                    setToOpen(false);
                  }}
                  disabled={(date) => {
                    if (!rangeDate.from) return true;
                    return date < rangeDate.from;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {formData.leave_type === "half_day" && (
        <div className="flex flex-col gap-2">
          <Label>Reason:</Label>
          <Textarea
            placeholder="Description"
            className="w-full min-h-20"
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="w-full bg-gray-100 hover:bg-gray-200"
          onClick={onClearForm}
        >
          Clear
        </Button>
        <Button type="submit" className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 animate-spin" /> Submiting
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
