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
import { format } from "date-fns";

const PrintReportIrregularities = ({ report, report_count, displayDate }) => {
  function getHourDifferenceFormatted(punch) {
    if (!punch?.total_working_hours || !punch?.total_working_days)
      return "00:00";

    const [hoursStr, minutesStr] = punch.total_working_hours.split(":");
    const hours = parseInt(hoursStr, 10) || 0;
    const minutes = parseInt(minutesStr, 10) || 0;

    const totalWorked = hours + minutes / 60;
    const committed = punch.total_working_days * 9;
    const diff = totalWorked - committed;

    const absDiff = Math.abs(diff);
    const resultHours = Math.floor(absDiff);
    const resultMinutes = Math.round((absDiff - resultHours) * 60);

    const formatted = `${diff < 0 ? "-" : ""}${String(resultHours).padStart(
      2,
      "0"
    )}:${String(resultMinutes).padStart(2, "0")}`;
    return (
      <span
        className={`${
          diff < 0 ? "text-rose-400" : "text-emerald-600"
        } font-semibold`}
      >
        <span className={`${diff < 0 ? "hidden" : ""}`}>+</span>
        {formatted}
      </span>
    );
  }

  return (
    <div className="print:p-0 print:m-[1in] print:font-arial">
      <h2 className="text-lg font-semibold mb-4 text-center hidden print:block">
        Irregularities Report for{" "}
        {displayDate?.from && (
          <span>
            {format(new Date(displayDate?.from), "LLL dd, y")}
            {displayDate?.to && " to "}
          </span>
        )}
        {displayDate?.to && (
          <span>{format(new Date(displayDate?.to), "LLL dd, y")}</span>
        )}
      </h2>
      <Table className="bg-background">
        <TableHeader>
          <TableRow className="text-nowrap print:text-nowrap print:text-xs bg-gray-50 dark:bg-slate-900">
            {/* <TableHead className="text-center">Serial</TableHead> */}
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Avg Hours</TableHead>
            <TableHead className="text-center">
              <span className="text-rose-400">&lt;</span>7:00
            </TableHead>
            <TableHead className="text-center">(7:00 - 7:15)</TableHead>
            <TableHead className="text-center">
              <span className="text-rose-400">&gt;</span>7:15
            </TableHead>
            <TableHead className="text-center">
              <span className="text-rose-400">&lt;</span>8:30
            </TableHead>
            <TableHead className="text-center">(8:30 - 9:00)</TableHead>
            <TableHead className="text-center">
              <span className="text-rose-400">&gt;</span>9:00
            </TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Worked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report?.map((punch, index) => (
            <TableRow
              key={index}
              className={`text-nowrap text-center border-none print:text-xs print:text-gray-600 even:bg-gray-100 even:dark:bg-slate-900 dark:text-muted-foreground`}
            >
              {/* <TableCell>{punch?.serial_no}</TableCell> */}
              <TableCell className="text-left">
                {punch?.employee_name?.split(" ").slice(0, 3).join(" ")}
              </TableCell>
              <TableCell>{punch?.avg_hours_per_day}</TableCell>
              <TableCell>{punch?.before_7am}</TableCell>
              <TableCell>{punch?.between_7_and_7_15_59}</TableCell>
              <TableCell>{punch?.after_7_15_59}</TableCell>
              <TableCell>{punch?.less_8_30}</TableCell>
              <TableCell>{punch?.between_8_30_and_9_00}</TableCell>
              <TableCell>{punch?.greater_9_00}</TableCell>
              <TableCell>{getHourDifferenceFormatted(punch)}</TableCell>
              <TableCell>
                {punch?.total_working_hours}/{punch?.total_working_days * 9}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={10}
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

export default PrintReportIrregularities;
