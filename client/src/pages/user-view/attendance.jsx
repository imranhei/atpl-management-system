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
import PaginationWithEllipsis from "@/components/user-view/paginationWithEllipsis";

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        dispatch(
          getAttendance({
            token: parsedToken,
            page: currentPage,
            start_date: date.from
              ? format(date.from, "yyyy-MM-dd") // Format date to API format
              : null,
            end_date: date.to
              ? format(date.to, "yyyy-MM-dd") // Format date to API format
              : null,
          })
        );
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, [dispatch, currentPage, date]);

  const { punch_details, pagination } = attendance || {};

  const handleDateFilter = () => {
    setCurrentPage(1); // Reset to the first page when filtering
    // Trigger a new API call by updating the `date` state
  };

  return (
    <div className="space-y-2 relative">
      <div className="m-0 sm:pb-4 text-lg font-bold xl:text-center">
        Atpl Dhaka Attendance
      </div>
      <div className="sm:absolute -top-2 right-0 flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[230px] justify-start text-left font-normal",
                !date.from && !date.to && "text-muted-foreground"
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
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        <Button
          onClick={() =>
            setDate({
              from: null,
              to: null,
            })
          }
          disabled={!date.from && !date.to}
        >
          <FilterX size={20} />
        </Button>
      </div>
      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Working Time</TableHead>
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
          ) : punch_details?.length > 0 ? (
            punch_details.map((punch, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <TableCell>{attendance?.name}</TableCell>
                <TableCell>{punch?.date}</TableCell>
                <TableCell>
                  {punch?.first_punch_time.split(" ")[1].split(".")[0]}
                </TableCell>
                <TableCell>
                  {punch?.last_punch_time.split(" ")[1].split(".")[0]}
                </TableCell>
                <TableCell>{punch?.total_time.split(".")[0]}</TableCell>
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
                Showing {punch_details?.length} of {pagination?.total} entries
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
