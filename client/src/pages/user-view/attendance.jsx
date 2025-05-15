import { getAttendance } from "@/store/employee/attendance-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CalendarIcon, CircleCheck, FilterX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationWithEllipsis from "@/components/user-view/paginationWithEllipsis";
import TextChangeAnimation from "@/components/common/TextChangeAnimation";

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const { results, pagination } = attendance || {};
  const [params, setParams] = useState({
    emp_code: null,
    page: 1,
    per_page: 15,
    start_date: null,
    end_date: null,
  });

  const formatDate = (date) => (date ? format(date, "MMM dd") : null);
  const formatApiDate = (date) => (date ? format(date, "yyyy-MM-dd") : null);

  const fetchAttendance = (override = {}) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(getAttendance({ token, ...params, ...override }));
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [params]);

  const handleDateChange = (range) => {
    const from = formatApiDate(range?.from);
    const to = formatApiDate(range?.to);
    setParams((prev) => ({
      ...prev,
      page: 1,
      start_date: from,
      end_date: to,
    }));
  };

  const handleClearDate = () => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      start_date: null,
      end_date: null,
    }));
  };

  return (
    <div className="sm:space-y-4 space-y-2 relative">
      <div className="m-0 text-lg font-bold text-center">
        Atpl Dhaka Attendance
      </div>
      
      <div className="flex gap-2 justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !params.start_date &&
                  !params.end_date &&
                  "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2" />
              {params.start_date ? (
                params.end_date ? (
                  <>
                    {format(new Date(params.start_date), "LLL dd, y")} -{" "}
                    {format(new Date(params.end_date), "LLL dd, y")}
                  </>
                ) : (
                  format(new Date(params.start_date), "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={
                params.start_date ? new Date(params.start_date) : undefined
              }
              selected={{
                from: params.start_date
                  ? new Date(params.start_date)
                  : undefined,
                to: params.end_date ? new Date(params.end_date) : undefined,
              }}
              onSelect={(range) => handleDateChange(range)}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleClearDate}
                disabled={!params.start_date && !params.end_date}
              >
                <FilterX size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow className="text-nowrap">
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Entry</TableHead>
            <TableHead className="text-center">Exit</TableHead>
            <TableHead className="text-center">Hours</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center space-y-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-[29px] rounded-lg"
                  />
                ))}
              </TableCell>
            </TableRow>
          ) : results?.length > 0 ? (
            results.map((punch, index) => (
              <TableRow
                key={index}
                className={`text-nowrap text-center ${
                  index % 2 === 0 ? "bg-gray-100" : ""
                }`}
              >
                {/* <TableCell>{punch?.first_name}</TableCell> */}
                <TableCell>{formatDate(punch?.date)}</TableCell>
                <TableCell>{punch?.first_punch_time}</TableCell>
                <TableCell>{punch?.last_punch_time}</TableCell>
                <TableCell>{punch?.total_hour}</TableCell>
                {/* <TableCell>{punch?.status}</TableCell> */}
                <TableCell className="!p-1 min-w-32 w-44 sm:text-sm text-xs">
                  <TextChangeAnimation punch={punch} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No attendance data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Skeleton className="w-full h-[28px] rounded-lg" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-right">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Show</span>
                    <Select
                      onValueChange={(value) => {
                        setParams((prev) => ({
                          ...prev,
                          page: 1,
                          per_page: Number(value),
                        }));
                      }}
                      defaultValue={params.per_page.toString()}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">entries</span>
                  </div>
                  <p>
                    Showing {results?.length || 0} of {pagination?.total || 0}{" "}
                    entries
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>

      {pagination?.last_page > 1 && (
        <PaginationWithEllipsis
          currentPage={params.page}
          totalPages={pagination?.last_page}
          onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default Attendance;
