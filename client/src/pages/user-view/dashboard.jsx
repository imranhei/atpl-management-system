import React, { useEffect } from "react";
import { getAttendance } from "@/store/employee/attendance-slice";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import TextChangeAnimation from "@/components/common/TextChangeAnimation";
import WorkCountdown from "@/components/user-view/Countdown";
import ProgressAnimation from "@/components/user-view/ProgressAnimation";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);

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
          })
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
        className={`${remain > 0 ? "text-rose-400" : "text-emerald-500"}`}
      >{`${String(totalHours).padStart(2, "0")}:${String(
        remainingMinutes
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
    <div>
      <div className="shadow rounded-md bg-white sm:p-4 p-2">
        <div className="flex justify-between items-center pb-4">
          <p className="text-lg font-semibold">This Week Attendance</p>
          <WorkCountdown results={results} />
        </div>
        <Table className="bg-background rounded border-b">
          <TableHeader>
            <TableRow className="text-nowrap bg-sky-100">
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
                  className={`text-nowrap text-center ${
                    index % 2 === 0 ? "bg-gray-100" : ""
                  }`}
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
        <div className="w-full grid grid-cols-2 grid-rows-2 pt-4 sm:text-xl text-base font-bold sm:gap-4 gap-2">
          <div className="flex flex-col justify-center items-center gap-1 sm:h-20 h-16 rounded shadow-lg shadow-emerald-200/50 border ">
            <span className="text-muted-foreground">Days</span>
            <span className=" text-emerald-500">{results?.length}</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 sm:h-20 h-16 rounded shadow-lg shadow-emerald-200/50 border">
            <span className="text-muted-foreground ">Avg Hour</span>
            <span className=" text-emerald-500">
              {calculateAvgTime(results, "total_hour")}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:h-20 h-16 rounded shadow-lg shadow-emerald-200/50 border p-2">
            <div className="flex flex-col items-center flex-1">
              <span className="text-muted-foreground">Avg In</span>
              <span className="text-emerald-500">
                {calculateAvgTime(results, "first_punch_time")}
              </span>
            </div>
            <div className="border-r border-muted-foreground/50 rotate-12 h-full"></div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-muted-foreground">Avg Out</span>
              <span className="text-emerald-500">
                {calculateAvgTime(results, "last_punch_time")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:h-20 h-16 rounded shadow-lg shadow-emerald-200/50 border p-2 relative">
            <div className="absolute top-0 left-0 w-full h-full">
              <ProgressAnimation value={calculateWorkProgressPercentage(results)} aamplitude={40} />
            </div>
            <div className="flex flex-col items-center flex-1 z-10">
              <span className="text-muted-foreground mix-blend-difference">Committed</span>
              <span className="text-emerald-500">{results?.length * 9}:00</span>
            </div>
            <div className="border-r border-muted-foreground/50 rotate-12 h-full"></div>
            <div className="flex flex-col items-center flex-1 z-10">
              <span className="text-muted-foreground">Worked</span>
              <span>{sumTotalHours(results)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
