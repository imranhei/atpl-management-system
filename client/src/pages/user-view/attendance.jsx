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
import { CalendarIcon, FilterX } from "lucide-react";
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

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const { results, pagination } = attendance || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [rangeType, setRangeType] = useState("7");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        dispatch(
          getAttendance({
            token,
            page: currentPage,
            start_date: date?.from
              ? format(date?.from, "yyyy-MM-dd") // Format date to API format
              : null,
            end_date: date?.to
              ? format(date?.to, "yyyy-MM-dd") // Format date to API format
              : null,
          })
        );
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, [dispatch, currentPage, date]);

  return (
    <div className="sm:space-y-4 space-y-2 relative">
      <div className="m-0 text-lg font-bold text-center">
        Atpl Dhaka Attendance
      </div>
      {/* <div className="flex gap-2 justify-end">
        <Button className="">Last 7 Days</Button>
        <Button>Last 15 Days</Button>
        <Button>Last 30 Days</Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[230px] justify-start text-left font-normal",
                !date?.from && !date?.to && "text-muted-foreground"
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
                setCurrentPage(1);
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => {
                  setDate({
                    from: null,
               to: null,
                  });
                  setCurrentPage(1);
                }}
                disabled={!date?.from && !date?.to}
              >
                <FilterX size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear filter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div> */}     
      <div className="flex gap-2 justify-end flex-wrap">
        <Select
          defaultValue="7"
          onValueChange={(value) => {
            setRangeType(value);
            const today = new Date();
            const from = new Date();
            if (value !== "custom") {
              from.setDate(today.getDate() - parseInt(value));
              setDate({ from, to: today });
              setCurrentPage(1);
            } else {
              setDate({ from: null, to: null });
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="15">Last 15 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        {rangeType === "custom" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[230px] justify-start text-left font-normal",
                  !date?.from && !date?.to && "text-muted-foreground"
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
                  setCurrentPage(1);
                }}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setDate({ from: null, to: null });
                  setRangeType("7");
                  setCurrentPage(1);
                }}
                disabled={!date?.from && !date?.to}
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
          <TableRow className="bg-amber-200 text-nowrap">
            {/* <TableHead>Name</TableHead> */}
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Entry</TableHead>
            <TableHead className="text-center">Exit</TableHead>
            <TableHead className="text-center">Duration</TableHead>
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
                <TableCell>{punch?.date}</TableCell>
                <TableCell>{punch?.first_punch_time}</TableCell>
                <TableCell>{punch?.last_punch_time}</TableCell>
                <TableCell>{punch?.total_hour}</TableCell>
                <TableCell>{punch?.status}</TableCell>
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
                Showing {results?.length} of {pagination?.total} entries
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>

      {pagination?.last_page > 1 && (
        <PaginationWithEllipsis
          currentPage={currentPage}
          totalPages={pagination?.last_page}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default Attendance;
