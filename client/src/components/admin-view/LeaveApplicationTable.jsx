import Box from "@/components/ui/box";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { LoaderCircle } from "lucide-react";

const LeaveApplicationTable = ({ data = [], isLoading }) => {
  return (
    <Box>
      <h2 className="text-lg font-bold py-2 text-center">Application History</h2>
      <Table className="bg-background rounded">
        {/* Table Header */}
        <TableHeader>
          <TableRow className="bg-sidebar">
            {data[0]?.user && <TableHead>Name</TableHead>}
            <TableHead>Date(s)</TableHead>
            {data[0]?.user && <TableHead className="text-center">Notified</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="p-0">
                <div className="flex w-full items-center justify-center">
                  <LoaderCircle
                    size={16}
                    className="animate-spin text-muted-foreground"
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id}
                className={`${index % 2 !== 0 ? "bg-slate-50" : ""}`}
              >
                {row?.user && (
                  <TableCell>
                    {`${(row.user?.first_name + " " + row.user?.last_name)
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}`}
                  </TableCell>
                )}
                <TableCell>
                  {(() => {
                    // Normalize row.date into an array of strings
                    const datesRaw = Array.isArray(row.date)
                      ? row.date
                      : row.date
                      ? [row.date]
                      : [];

                    // Format safely; fall back to raw if parsing fails
                    const formatted = datesRaw.map((d) => {
                      try {
                        return format(parseISO(d), "LLL dd, y");
                      } catch {
                        return d;
                      }
                    });

                    const visible = formatted.slice(0, 2);
                    const extra = formatted.slice(2);

                    return (
                      <div className="flex flex-wrap items-center gap-1">
                        {visible.map((d, i) => (
                          <span
                            key={`${d}-${i}`}
                            className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-background"
                          >
                            {d}
                          </span>
                        ))}

                        {extra.length > 0 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="text-xs underline px-1 py-0.5"
                                aria-label={`Show ${extra.length} more dates`}
                              >
                                +{extra.length} more
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2">
                              <div className="flex flex-wrap gap-1 max-h-48 overflow-auto">
                                {extra.map((d, i) => (
                                  <span
                                    key={`${d}-extra-${i}`}
                                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-background"
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    );
                  })()}
                </TableCell>
                {row.user && (
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                      row.informed_status === "informed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    >
                    {row?.informed_status ? row?.informed_status[0].toUpperCase() + row.informed_status.slice(1) : "-"}
                    </span>
                  </TableCell>
                )}
                <TableCell>{row.leave_type}</TableCell>
                <TableCell className="whitespace-pre-line">
                  {row.reason}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      row.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : row.status === "pending"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.status[0].toUpperCase() + row.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </Box>
  );
};

export default LeaveApplicationTable;
