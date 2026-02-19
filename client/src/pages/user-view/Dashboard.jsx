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
import ProgressAnimation from "@/components/user-view/ProgressAnimation";
import { getAttendance } from "@/store/employee/attendance-slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RamadanCalendar from "../common/RamadanCalendar";
import WorkCountdown from "@/components/user-view/Countdown";

const Dashboard = () => {
  const [calendarData, setCalendarData] = React.useState(null);
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);

  // 👉 FIXED: Calendar fetch function
  function fetchCalendar(month) {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(
      `https://djangoattendance.atpldhaka.com/api/leave/calendar/?month=${month}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => res.json())
      .then((data) => setCalendarData(data))
      .catch((err) => console.error("Calendar error", err));
  }

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7); // example: 2025-11
    fetchCalendar(month);
  }, []);

  function getWeekRange(date) {
    // Convert input to a Date object if it's not already
    const givenDate = new Date(date);

    // Calculate the day of the week (0 for Sunday, 6 for Saturday)
    const dayOfWeek = givenDate.getDay();

    // Calculate the difference from the given day to Saturday (start of the week)
    const diffToSaturday = (dayOfWeek + 1) % 7; // Adjust for Saturday as start of the week
    const diffToFriday = 6 - diffToSaturday; // Days until Friday (end of the week)

    // Calculate the start and end dates
    const startOfWeek = new Date(givenDate);
    startOfWeek.setDate(givenDate.getDate() - diffToSaturday);

    const endOfWeek = new Date(givenDate);
    endOfWeek.setDate(givenDate.getDate() + diffToFriday);

    // Format the dates as 'YYYY-MM-DD'
    const formatDate = (date) => date.toISOString().split("T")[0];

    return {
      start: formatDate(startOfWeek),
      end: formatDate(endOfWeek),
    };
  }

  useEffect(() => {
    const today = new Date();
    const weekRange = getWeekRange(today);
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        dispatch(
          getAttendance({
            token,
            start_date: weekRange.start,
            end_date: weekRange.end,
          }),
        );
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const { results } = attendance || {};

  const calculateAvgTime = (punchDetails, key) => {
    if (!punchDetails?.length) return "00:00:00";

    const totalSeconds = punchDetails.reduce((total, punch) => {
      let timeString = punch[key];

      if (!timeString || typeof timeString !== "string") return total;

      const timeParts = timeString.split(":").map((t) => parseInt(t, 10));

      let hours = 0,
        minutes = 0,
        seconds = 0;

      if (timeParts.length === 3) {
        [hours, minutes, seconds] = timeParts;
      } else if (timeParts.length === 2) {
        [hours, minutes] = timeParts;
      }

      return total + hours * 3600 + minutes * 60 + seconds;
    }, 0);

    const avgSeconds = Math.floor(totalSeconds / punchDetails.length);

    const hours = Math.floor(avgSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((avgSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (avgSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  function sumTotalHours(results) {
    let totalMinutes = 0;

    results?.forEach((item) => {
      if (!item.total_hour) return;
      const [hoursStr, minutesStr] = item.total_hour.split(":");
      const hours = parseInt(hoursStr, 10) || 0;
      const minutes = parseInt(minutesStr, 10) || 0;
      totalMinutes += hours * 60 + minutes;
    });

    const remain = results?.length * 9 * 60 - totalMinutes;

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return (
      <span
        className={`${
          remain > 0
            ? "text-rose-400 dark:text-rose-400"
            : "text-emerald-500 dark:text-emerald-300"
        }`}
      >{`${String(totalHours).padStart(2, "0")}:${String(
        remainingMinutes,
      ).padStart(2, "0")}`}</span>
    );
  }

  function calculateWorkProgressPercentage(results, committedHoursPerDay = 9) {
    let totalMinutesWorked = 0;

    results?.forEach((item) => {
      if (!item.total_hour) return;
      const [hoursStr, minutesStr] = item.total_hour.split(":");
      const hours = parseInt(hoursStr, 10) || 0;
      const minutes = parseInt(minutesStr, 10) || 0;
      totalMinutesWorked += hours * 60 + minutes;
    });

    const totalCommittedMinutes = committedHoursPerDay * 60 * results?.length;

    const percentage = totalCommittedMinutes
      ? Math.round((totalMinutesWorked / totalCommittedMinutes) * 100)
      : 0;

    return percentage;
  }

  return (
    <>
      <div className="relative">
        <RamadanCalendar />
        <div className="absolute top-4 right-4 z-10" >
          {/* <WorkCountdown results={results} /> */}
        </div>
      </div>
      <div className="rounded-md m-4 sm:space-y-4 space-y-3">
        <Box className="!flex-row justify-between items-center p-2 sm:mb-4 mb-2">
        <p className="text-lg font-bold text-textHead">Weekly Summary</p>
        <WorkCountdown results={results} />
      </Box>
        <div className="w-full grid grid-cols-2 grid-rows-2 sm:text-lg text-sm font-bold sm:gap-4 gap-3 sm:mt-2">
          <Box className="sm:h-[72px] h-14">
            <span className="text-textHead">Days</span>
            <span className=" text-emerald-500 dark:text-emerald-300">
              {results?.length}
            </span>
          </Box>
          <Box className="sm:h-[72px] h-14">
            <span className="text-textHead">Avg Hour</span>
            <span className=" text-emerald-500 dark:text-emerald-300">
              {calculateAvgTime(results, "total_hour")}
            </span>
          </Box>
          <Box className="sm:h-[72px] h-14 !flex-row p-2">
            <div className="flex flex-col items-center flex-1">
              <span className="text-textHead">Avg In</span>
              <span className="text-emerald-500 dark:text-emerald-300">
                {calculateAvgTime(results, "first_punch_time")}
              </span>
            </div>
            <div className="border-r border-muted-foreground/50 rotate-12 h-full"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-textHead">Avg Out</span>
              <span className="text-emerald-500 dark:text-emerald-300">
                {calculateAvgTime(results, "last_punch_time")}
              </span>
            </div>
          </Box>
          <Box className="sm:h-[72px] h-14 !flex-row p-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <ProgressAnimation
                value={calculateWorkProgressPercentage(results)}
                aamplitude={30}
              />
            </div>
            <div className="flex flex-col items-center flex-1 z-10">
              <span className="text-muted-foreground mix-blend-difference dark:text-slate-300">
                Committed
              </span>
              <span className="text-emerald-500 dark:text-emerald-300">
                {results?.length * 9}:00
              </span>
            </div>
            <div className="border-r border-muted-foreground/50 rotate-12 h-full"></div>
            <div className="flex flex-col items-center flex-1 z-10">
              <span className="text-muted-foreground dark:text-slate-300">
                Worked
              </span>
              <span>{sumTotalHours(results)}</span>
            </div>
          </Box>
        </div>

        <Box>
          <h1 className="text-lg font-bold p-2 text-center text-textHead">
            Daily Attendance
          </h1>
          <Table className="bg-background rounded border-b">
            <TableHeader>
              <TableRow className="text-nowrap dark:text-textHead">
                {/* <TableHead>Name</TableHead> */}
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Entry</TableHead>
                <TableHead className="text-center">Exit</TableHead>
                <TableHead className="text-center">Hours</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // <<TableRow>
                //   <TableCell colSpan={5} className="text-center space-y-2">
                //     {Array.from({ length: 10 }).map((_, index) => (
                //       <Skeleton
                //         key={index}
                //         className="w-full h-[29px] rounded-lg"
                //       />
                //     ))}
                //   </TableCell>
                // </TableRow>>
                <></>
              ) : results?.length > 0 ? (
                results.map((punch, index) => (
                  <TableRow
                    key={index}
                    className="text-center text-nowrap text-textBody"
                  >
                    {/* <TableCell>{punch?.first_name}</TableCell> */}
                    <TableCell>{formatDate(punch?.date)}</TableCell>
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
                    No attendance data found.
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
    </>
  );
};

export default Dashboard;
