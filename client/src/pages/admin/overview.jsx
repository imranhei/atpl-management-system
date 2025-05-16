import { Button } from "@/components/ui/button";
import { Printer, CalendarIcon } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceSummary } from "@/store/admin/employee-details-slice";
import { format, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useReactToPrint } from "react-to-print";
import PrintReportOverview from "@/components/admin-view/PrintReportOverview";

const Reports = () => {
  const printRef = useRef(null);
  const dispatch = useDispatch();
  const { attendanceSummary, isLoading } = useSelector(
    (state) => state.employeeDetails
  );
  const { report, report_count } = attendanceSummary || {};
  const [customDate, setCustomDate] = useState({ from: null, to: null });

  const formatDate = (date) => (date ? format(date, "yyyy-MM-dd") : null);

  const handleCustomDateChange = (range) => {
    if (!range) return;
    setCustomDate(range);
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(
        getAttendanceSummary({
          token,
          start_date: formatDate(range?.from),
          end_date: formatDate(range?.to),
        })
      );
    }
  };

  const displayDate = () => {
    if (!customDate || !customDate.from) return "Pick a date";
    const { from, to } = customDate;
    return to
      ? `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`
      : format(from, "LLL dd, y");
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Attendance Report",
    removeAfterPrint: true,
  });

  useEffect(() => {
    const today = new Date();
    const end = format(today, "yyyy-MM-dd");
    const start = format(subDays(today, 30), "yyyy-MM-dd");
    setCustomDate({ from: subDays(today, 30), to: today });
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(
        getAttendanceSummary({ token, start_date: start, end_date: end })
      );
    }
  }, [dispatch]);

  return (
    <div className="sm:space-y-4 space-y-2">
      <h1 className="sm:text-xl text-base font-semibold text-center">
        Attendance Report for {displayDate()}
      </h1>
      <div className="flex gap-2 flex-wrap rounded-sm justify-end">
        <div className="min-w-[200px] flex-1 flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !customDate?.from &&
                    !customDate?.to &&
                    "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {displayDate()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={customDate?.from || undefined}
                selected={customDate}
                onSelect={handleCustomDateChange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handlePrint}>
          <Printer size={20} />
          Print
        </Button>
      </div>
      <div ref={printRef}>
        <PrintReportOverview report={report} report_count={report_count} displayDate={displayDate} />
      </div>
    </div>
  );
};

export default Reports;
