import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

const LeaveForm = ({ formData, setFormData, onSubmit }) => {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date(),
  });

  return (
    <form
      className="space-y-2 py-6 bg-container rounded shadow-spread border p-4 "
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Label className="text-nowrap w-24">Select Day:</Label>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "max-w-[300px] justify-start text-left font-normal bg-sidebar",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  setFormData((prev) => ({
                    ...prev,
                    leave_date_from: date?.from,
                    leave_date_to: date?.to || date?.from,
                  }));
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-2 items-center mb-4">
        <Label className="text-nowrap w-24">Leave Type:</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, leave_type: value }))
          }
          value={formData.leave_type || undefined}
        >
          <SelectTrigger className="flex-1 max-w-80">
            <SelectValue placeholder="Select Leave Type" />
          </SelectTrigger>
          <SelectContent>
            {[
              { label: "Full", value: "full" },
              { label: "Half", value: "half" },
            ].map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-center mb-4">
        <Label className="text-nowrap w-24">Leave Reason:</Label>
        <Select
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, reason: value }))
          }
          value={formData.reason || undefined}
        >
          <SelectTrigger className="flex-1 max-w-80">
            <SelectValue placeholder="Select Leave Reason" />
          </SelectTrigger>
          <SelectContent>
            {["Personal", "Family Issue", "Sick"].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{"Submit"}</Button>
    </form>
  );
};

export default LeaveForm;
