import Box from "@/components/ui/box";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchLeaveSummary } from "@/store/leave/leave-slice";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

const ENTITLEMENT = 21;

const typeMap = {
  full_day: "Full Day",
  "1st_half": "1st Half",
  "2nd_half": "2nd Half",
};

const EmployeeLeaveHistory = () => {
  const dispatch = useDispatch();
  const { leaveSummary, details, isLoading } = useSelector((s) => s.leaveApplication);

  const fmt = (n) => {
    const num = Number(n || 0);
    return Number.isInteger(num) ? String(num) : num.toFixed(1);
  };

  const chartData = (leaveSummary[0]?.monthly_breakdown || []).map((m) => ({
    month: m.month,
    leave: Number(m.leave || 0),
    informed_leave: Number(m.informed_leave || 0),
    uninformed_leave: Number(m.uninformed_leave || 0),
  }));

  const taken = Number(leaveSummary[0]?.total_leave || 0);
  const pct = Math.min(100, Math.max(0, (taken / ENTITLEMENT) * 100));

  function formatYMDToShort(ymd) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) return ymd; // fallback if not YYYY-MM-DD
    const [, y, mo, d] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d)); // local date
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  useEffect(() => {
    dispatch(fetchLeaveSummary({details:true}));
  }, [dispatch]);

  return (
    <div className="m-4 sm:space-y-4 space-y-3">
      <CardContent className="flex items-center justify-center select-none cursor-default">
        <div className="h-fit w-full p-4 bg-container rounded-lg shadow-spread border space-y-1 relative flex flex-col items-center justify-start overflow-hidden">
          <div className="flex justify-between items-end w-full text-sm">
            <div className="text-muted-foreground font-semibold">Leave Taken</div>
            <div className="font-semibold">
              <span className="text-rose-400 text-3xl">{fmt(taken)}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-green-400">{ENTITLEMENT}</span>
            </div>
          </div>

          <div className="w-full h-1 bg-gray-200 relative z-10 rounded">
            <div
              className="absolute left-0 z-20 h-full bg-rose-400 rounded"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="w-full rounded mt-2">
            <ChartContainer
              config={{ leave: { label: "Day", color: "var(--chart-1)" } }}
              className="h-40 w-full"
            >
              <BarChart data={chartData} margin={{ top: 25, bottom: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickFormatter={(v) => String(v).slice(0, 3)}
                  angle={-90}
                  textAnchor="end"
                  dx={-5}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="leave" fill="#fb7185" radius={4}>
                  <LabelList
                    position="top"
                    offset={6}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>

      <Box>
        <h2 className="text-lg font-semibold py-2">Leave History</h2>
        <Table className="bg-background rounded">
          <TableHeader>
            <TableRow className="bg-sidebar dark:bg-slate-900">
              <TableHead className="text-center w-14">SL No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="min-w-40">Reason</TableHead>
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
              {details?.map((row, index) => (
                <TableRow
                  key={index}
                  className={`${index % 2 !== 0 ? "bg-slate-50 dark:bg-slate-900" : ""}`}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{formatYMDToShort(row.date)}</TableCell>
                  <TableCell>{typeMap[row.leave_type]}</TableCell>
                  <TableCell className="align-top">
                    {(() => {
                      const text = row?.reason ?? "";
                      const isLong = text && text.length > 120; // heuristic; tweak as needed

                      return (
                        <div className="max-w-md">
                          {/* 2-line clamp with ellipsis */}
                          <p className="whitespace-pre-line line-clamp-2">
                            {text || (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </p>

                          {/* 'See more' opens a popover with full text */}
                          {isLong && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="mt-1 text-xs underline text-muted-foreground hover:text-foreground"
                                  aria-label="Read full reason"
                                >
                                  See more
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                sideOffset={8}
                                className="w-80 max-h-64 overflow-auto whitespace-pre-line"
                              >
                                {text}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </Box>
    </div>
  );
};

export default EmployeeLeaveHistory;
