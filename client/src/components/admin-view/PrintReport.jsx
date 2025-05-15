import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PrintReport = ({ report, report_count, displayDate }) => {
  return (
    <div className="print:p-0 print:m-[1in] print:font-arial">
      <h2 className="text-lg font-semibold mb-4 text-center hidden print:block">
        Attendance Report for {displayDate()}
      </h2>
      <Table className="bg-background">
        <TableHeader>
          <TableRow className="text-nowrap print:text-nowrap print:text-xs bg-gray-50">
            {/* <TableHead className="text-center">Serial</TableHead> */}
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Avg Hours</TableHead>
            <TableHead className="text-center">Working Days</TableHead>
            <TableHead className="text-center">Working Hours</TableHead>
            <TableHead className="text-center">Avg Sign-In</TableHead>
            <TableHead className="text-center">Avg Sign-Out</TableHead>
            <TableHead className="text-center">Leave</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report?.map((punch, index) => (
            <TableRow
              key={index}
              className={`text-nowrap text-center border-none print:text-xs print:text-gray-600 ${
                index % 2 === 0 ? "bg-gray-100" : ""
              }`}
            >
              {/* <TableCell>{punch?.serial_no}</TableCell> */}
              <TableCell className="text-left">
                {punch?.employee_name?.split(" ").slice(0, 3).join(" ")}
              </TableCell>
              <TableCell>{punch?.avg_hours_per_day}</TableCell>
              <TableCell>{punch?.total_working_days}</TableCell>
              <TableCell>{punch?.total_working_hours}</TableCell>
              <TableCell>{punch?.avg_sign_in}</TableCell>
              <TableCell>{punch?.avg_sign_out}</TableCell>
              <TableCell>{punch?.total_vacation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-right print:text-xs font-medium print:text-gray-600 print:hidden"
            >
              Total Entries: {report?.length || 0} / {report_count || 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default PrintReport;
