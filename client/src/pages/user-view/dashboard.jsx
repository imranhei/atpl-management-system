import React, { useEffect } from "react";
import { getAttendance } from "@/store/employee/attendance-slice";
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
  
      let hours = 0, minutes = 0, seconds = 0;
  
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

  return (
    <div>
      <div className="shadow rounded-md bg-white p-4">
        <p className="text-lg font-semibold pb-2">This Week Attendance</p>
        <Table className="bg-background rounded">
          <TableHeader>
            <TableRow className="text-nowrap bg-sky-100">
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
                  className={`text-nowrap text-center ${index % 2 === 0 ? "bg-gray-100" : ""}`}
                >
                  {/* <TableCell>{punch?.first_name}</TableCell> */}
                  <TableCell>{formatDate(punch?.date)}</TableCell>
                  <TableCell>
                    {punch?.first_punch_time}
                  </TableCell>
                  <TableCell>
                    {punch?.last_punch_time}
                  </TableCell>
                  <TableCell className="font-semibold">{punch?.total_hour}</TableCell>
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
          <TableFooter className="bg-sky-100">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Skeleton className="w-full h-[28px] rounded-lg" />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex sm:flex-row flex-col justify-between w-full gap-2 text-nowrap">
                    <div className="flex gap-1">
                      <span className="font-semibold">Days:</span>
                      <span>{results?.length}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-semibold">Avg In:</span>
                      <span>
                        {calculateAvgTime(results, "first_punch_time")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-semibold">Avg Out:</span>
                      <span>
                        {calculateAvgTime(results, "last_punch_time")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-semibold">Avg Time:</span>
                      <span>
                        {calculateAvgTime(results, "total_hour")}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
