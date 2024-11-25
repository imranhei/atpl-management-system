import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LeaveApplicationTable = ({ data }) => {
  return (
    <Table className="bg-background rounded">
      {/* Table Header */}
      <TableHeader>
        <TableRow>
          <TableHead>Emp Code</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      {/* Table Body */}
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={row.id}
            className={`${index % 2 === 0 ? "bg-slate-50" : ""}`}
          >
            <TableCell>{row.emp_code}</TableCell>
            <TableCell>{row.leave_date_from}</TableCell>
            <TableCell>{row.leave_date_to}</TableCell>
            <TableCell>{row.leave_type}</TableCell>
            <TableCell>{row.reason}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  row.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {row.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeaveApplicationTable;
