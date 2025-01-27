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
import { Separator } from "@radix-ui/react-dropdown-menu";

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
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        dispatch(
          getAttendance({
            token: parsedToken,
            start_date: weekRange.start,
            end_date: weekRange.end,
          })
        );
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const { punch_details } = attendance || {};

  const calculateAvgTime = (punchDetails, key) => {
    if (!punchDetails?.length) return "00:00:00";

    // Convert all times to seconds
    const totalSeconds = punchDetails.reduce((total, punch) => {
      const value = punch[key];

      let time;
      if (key === "total_time") {
        // total_time is already in HH:mm:ss format
        time = value.split(":");
      } else {
        // Extract time part from date-time string (first_punch_time or last_punch_time)
        time = value.split(" ")[1].split(":");
      }

      const hours = parseInt(time[0], 10);
      const minutes = parseInt(time[1], 10);
      const seconds = parseInt(time[2], 10);

      return total + hours * 3600 + minutes * 60 + seconds; // Convert to seconds
    }, 0);

    // Calculate average in seconds
    const avgSeconds = Math.floor(totalSeconds / punchDetails.length);

    // Convert back to HH:mm:ss
    const hours = Math.floor(avgSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((avgSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (avgSeconds % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <div className="shadow rounded-md bg-white p-4">
        <p className="text-lg font-semibold">This Week Attendance</p>
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
                      <span className="font-semibold">Working Day:</span>
                      <span>{punch_details?.length}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-semibold">Avg entry:</span>
                      <span>
                        {calculateAvgTime(punch_details, "first_punch_time")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-semibold">Avg exit:</span>
                      <span>
                        {calculateAvgTime(punch_details, "last_punch_time")}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-semibold">Avg working time:</span>
                      <span>
                        {calculateAvgTime(punch_details, "total_time")}
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
