import { getAttendance } from "@/store/employee/attendance-slice";
import { getEmployeeDetails } from "@/store/admin/employee-details-slice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, subDays } from "date-fns";
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
import { CalendarIcon, Check, ChevronsUpDown, FilterX } from "lucide-react";
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
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import PaginationWithEllipsis from "@/components/user-view/paginationWithEllipsis";

const AdminAttendance = () => {
  const dispatch = useDispatch();
  const triggerRef = useRef(null);
  const { employeeDetails } = useSelector((state) => state.employeeDetails);
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const { results, pagination } = attendance || {};

  const [empListOpen, setEmpListOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [customDate, setCustomDate] = useState({ from: null, to: null });
  const [params, setParams] = useState({
    emp_code: null,
    page: 1,
    per_page: 15,
    start_date: null,
    end_date: null,
  });

  const formatDate = (date) => date ? format(date, "yyyy-MM-dd") : null;

  const fetchAttendance = (override = {}) => {
    console.log(params)
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(getAttendance({ token, ...params, ...override }));
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [params]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(getEmployeeDetails({ token }));
  }, [dispatch]);

  const handleEmployeeChange = (value) => {
    const selectedPerson = employeeDetails.find((emp) => `${emp.first_name} ${emp.last_name}` === value);
    const empCode = selectedPerson?.emp_code;
    setSelected((prev) => (prev?.emp_code === empCode ? null : selectedPerson));
    setParams((prev) => ({
      ...prev,
      emp_code: prev?.emp_code === empCode ? null : empCode,
      page: 1,
    }));
  };

  const handleRangeSelect = (value) => {
    const today = new Date();
    const from = subDays(today, Number(value));
    setDateRange(value);
    setCustomDate({ from: null, to: null });
    setParams((prev) => ({
      ...prev,
      start_date: formatDate(from),
      end_date: formatDate(today),
      page: 1,
    }));
  };

  const handleCustomDateChange = (range) => {
    setCustomDate(range);
    setDateRange(null);
    setParams((prev) => ({
      ...prev,
      start_date: formatDate(range?.from),
      end_date: formatDate(range?.to),
      page: 1,
    }));
  };

  const handlePerPageChange = (value) => {
    setParams((prev) => ({ ...prev, page: 1, per_page: parseInt(value) }));
  };

  const handlePageChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleClearDate = () => {
    setCustomDate({ from: null, to: null });
    setDateRange(null);
    setParams((prev) => ({ ...prev, start_date: null, end_date: null, page: 1 }));
  };

  const displayDate = () => {
    const { from, to } = customDate;
    if (!from) return "Pick a date";
    return to
      ? `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`
      : format(from, "LLL dd, y");
  };

  const formatDateToReadable = (dateString) => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short", // gives Jan, Feb, etc.
      year: "numeric",
    });
  };

  return (
    <div className="sm:space-y-4 space-y-2 relative">
      <div className="m-0 text-lg font-bold text-center">
        Atpl Dhaka Attendance
      </div>
      <div className="flex flex-wrap sm:gap-2 gap-1 max-w-[600px]">
        <Popover open={empListOpen} onOpenChange={setEmpListOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              variant="outline"
              aria-expanded={empListOpen}
              role="combobox"
              className={`w-[180px] justify-between font-normal overflow-hidden p-2 ${
                selected ? "" : "text-muted-foreground"
              }`}
            >
              {selected?.first_name ? `${selected?.first_name} ${selected?.last_name}` : "Select Employee"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[200px] flex-1 p-0">
            <Command>
              <CommandInput placeholder="Search name..." />
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {employeeDetails?.map((person) => (
                  <CommandItem
                    key={person.emp_code}
                    value={`${person?.first_name} ${person?.last_name}`}
                    onSelect={(value) => {
                        handleEmployeeChange(value);
                        setEmpListOpen(false);
                        triggerRef.current?.focus();
                    }}
                  >
                    {`${person?.first_name} ${person?.last_name}`}
                    <Check
                      className={cn(
                        "ml-auto",
                        selected?.emp_code === person.emp_code
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          value={dateRange || ""} // Fallback to empty string if null/undefined
          onValueChange={handleRangeSelect}
        >
          <SelectTrigger
            className={`min-w-28 w-40 px-2 bg-background ${
              dateRange ? "" : "text-muted-foreground"
            }`}
          >
            <SelectValue
              placeholder="Select range"
              className="placeholder:text-opacity-30"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="15">Last 15 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <div className="min-w-[200px] flex-1 flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !params.start_date &&
                    !params.end_date &&
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
      </div>
      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow className="bg-amber-200 text-nowrap">
            <TableHead>Name</TableHead>
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
              <TableCell colSpan={6} className="text-center space-y-2">
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
                <TableCell className="text-left">{`${punch?.first_name} ${punch?.last_name}`}</TableCell>
                <TableCell>{formatDateToReadable(punch?.date)}</TableCell>
                <TableCell>{punch?.first_punch_time}</TableCell>
                <TableCell>{punch?.last_punch_time}</TableCell>
                <TableCell>{punch?.total_hour}</TableCell>
                <TableCell>{punch?.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No attendance data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Skeleton className="w-full h-[28px] rounded-lg" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-right">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Show</span>
                    <Select
                      onValueChange={handlePerPageChange}
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminAttendance;
