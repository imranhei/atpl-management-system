import TextChangeAnimation from "@/components/common/TextChangeAnimation";
import Box from "@/components/ui/box";
import FullCalendarView from "@/components/ui/FullCalendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAttendance } from "@/store/employee/attendance-slice";
import { ArrowUpDown, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });
};

const parseTimeToMinutes = (timeStr = "00:00") => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const { results = [], pagination } = attendance || {};
  const [sortedResults, setSortedResults] = useState([]);
  const [sortState, setSortState] = useState({
    entry: "asc",
    duration: "asc",
  });

  const handleSort = (key) => {
    const newOrder = sortState[key] === "asc" ? "desc" : "asc";
    const sorted = [...sortedResults].sort((a, b) => {
      let aVal =
        key === "entry"
          ? new Date(`1970-01-01T${a.first_punch_time || "00:00:00"}`)
          : parseTimeToMinutes(a.total_hour);

      let bVal =
        key === "entry"
          ? new Date(`1970-01-01T${b.first_punch_time || "00:00:00"}`)
          : parseTimeToMinutes(b.total_hour);

      return newOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    setSortedResults(sorted);
    setSortState({ ...sortState, [key]: newOrder });
  };

  const todayLabel = `${formatDate(new Date())}, ${new Date().getFullYear()}`;

  useEffect(() => {
    const today = new Date();
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        dispatch(
          getAttendance({
            token,
            start_date: today.toISOString().split("T")[0],
            // end_date: formatDate(today),
            per_page: 20,
          })
        );
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (results?.length) {
      setSortedResults(results);
    }
  }, [results]);

  const [calendarData, setCalendarData] = useState(null);

  function fetchCalendar(month) {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(
      `https://djangoattendance.atpldhaka.com/api/leave/calendar/?month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setCalendarData(data))
      .catch((err) => console.error("Calendar error", err));
  }

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    fetchCalendar(month);
  }, []);

  return (
    <div className="m-4 sm:space-y-4 space-y-3">
      <div className="w-full grid grid-cols-3 sm:text-xl text-sm sm:font-bold font-semibold sm:gap-4 gap-3">
        <Box className="!flex-row sm:gap-4 gap-2 sm:p-4 p-2 text-muted-foreground">
          <Users className="sm:size-16 size-6" />
          <div className="flex flex-col sm:gap-1">
            <div>Employee</div>
            <div>15</div>
          </div>
        </Box>
        <Box className="!flex-row sm:gap-4 gap-2 sm:p-4 text-green-400">
          <Users className="sm:size-16 size-6" />
          <div className="flex flex-col sm:gap-1">
            <div className="text-muted-foreground">Present</div>
            <div>{pagination?.total || 0}</div>
          </div>
        </Box>
        <Box className="!flex-row sm:gap-4 gap-2 sm:p-4 text-rose-400">
          <Users className="sm:size-16 size-6" />
          <div className="flex flex-col sm:gap-1">
            <div className="text-muted-foreground">Absent</div>
            <div>{15 - pagination?.total || 0}</div>
          </div>
        </Box>
      </div>
      <Box className="shadow rounded-md">
        <p className="text-lg font-semibold p-2">Attendance for {todayLabel}</p>
        <Table className="bg-background rounded border-b">
          <TableHeader>
            <TableRow className="text-nowrap bg-gray-100 dark:bg-slate-900">
              <TableHead>Name</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  Entry{" "}
                  <ArrowUpDown
                    className="cursor-pointer opacity-30 hover:opacity-100"
                    onClick={() => handleSort("entry")}
                    size={16}
                  />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  Exit
                  <ArrowUpDown
                    className="cursor-pointer opacity-30 hover:opacity-100"
                    onClick={() => handleSort("entry")}
                    size={16}
                  />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-2">
                  Duration
                  <ArrowUpDown
                    className="cursor-pointer opacity-30 hover:opacity-100"
                    size={16}
                    onClick={() => handleSort("duration")}
                  />
                </div>
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              //   <TableRow>
              //     <TableCell colSpan={5} className="text-center space-y-2">
              //       {Array.from({ length: 10 }).map((_, index) => (
              //         <Skeleton
              //           key={index}
              //           className="w-full h-[29px] rounded-lg"
              //         />
              //       ))}
              //     </TableCell>
              //   </TableRow>
              <></>
            ) : results?.length > 0 ? (
              sortedResults.map((punch, index) => (
                <TableRow
                  key={index}
                  className="text-center text-nowrap text-textBody"
                >
                  <TableCell className="text-left">
                    {`${(punch?.first_name + " " + punch?.last_name)
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}`}
                  </TableCell>
                  {/* <TableCell>{formatDate(punch?.date)}</TableCell> */}
                  <TableCell>{punch?.first_punch_time}</TableCell>
                  <TableCell>{punch?.last_punch_time}</TableCell>
                  <TableCell className="font-semibold">
                    {punch?.total_hour}
                  </TableCell>
                  <TableCell className="!p-1 min-w-[136px] w-44 sm:text-sm text-xs">
                    <TextChangeAnimation punch={punch} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <p>No attendance data found for {todayLabel}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      {calendarData && (
        <FullCalendarView
          data={calendarData}
          onMonthChange={(newMonth) => fetchCalendar(newMonth)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
