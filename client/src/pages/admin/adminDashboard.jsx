import React, { useEffect, useState } from "react";
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
import { ArrowUpDown } from "lucide-react";

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

  return (
    <div>
      <div className="shadow rounded-md bg-white p-4">
        <p className="text-lg font-semibold pb-2">
          Attendance for {todayLabel}
        </p>
        <Table className="bg-background rounded">
          <TableHeader>
            <TableRow className="text-nowrap bg-sky-100">
              <TableHead>Name</TableHead>
              {/* <TableHead className="text-center">Date</TableHead> */}
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
                  className={`text-nowrap text-center ${
                    index % 2 === 0 ? "bg-gray-100" : ""
                  }`}
                >
                  <TableCell className="text-left">
                    {punch?.first_name}
                  </TableCell>
                  {/* <TableCell>{formatDate(punch?.date)}</TableCell> */}
                  <TableCell>{punch?.first_punch_time}</TableCell>
                  <TableCell>{punch?.last_punch_time}</TableCell>
                  <TableCell className="font-semibold">
                    {punch?.total_hour}
                  </TableCell>
                  <TableCell>{punch?.status}</TableCell>
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
                    <p>Present: {pagination?.total || 0}</p>
                    <p>Absent: {15 - pagination?.total || 0}</p>
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

export default AdminDashboard;
