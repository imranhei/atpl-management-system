import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchLeaveSummary } from "@/store/leave/leave-slice";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import avatar2 from "/avatar2.png";

const typeMap = {
  full_day: "Full Day",
  "1st_half": "1st Half",
  "2nd_half": "2nd Half",
};

const fmt = (n) => {
  const num = Number(n || 0);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
};

const resolveImg = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, "");
  return base ? `${base}${url}` : url;
};

const DetailLeaveSummary = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { leaveSummary, details, isLoading } = useSelector(
    (state) => state.leaveApplication
  );

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
    if (!id) return;
    dispatch(fetchLeaveSummary({ id, details: true }));
  }, [dispatch, id]);

  console.log(leaveSummary[0]?.profile_img);

  return (
    <div className="m-4 sm:space-y-4 space-y-3 relative">
      <Box>
        <h2 className="text-lg font-semibold py-2">Leave Summary</h2>
        <div className="flex gap-2 items-center justify-between w-full px-2 pb-2">
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              onClick={() => window.history.back()}
              variant="ghost"
              className="bg-transparent"
            >
              <ArrowLeft className="cursor-pointer" />
            </Button>
            <Avatar className="focus:outline-none ring-1 ring-white size-8 border-white">
              <AvatarImage
                src={resolveImg(leaveSummary[0]?.profile_img)}
                alt=""
                className="object-cover scale-125 object-top w-full h-full"
              />
              <AvatarFallback>
                <img src={avatar2} alt="" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg text-muted-foreground font-semibold">
              {leaveSummary[0]?.first_name + " " + leaveSummary[0]?.last_name}
            </h2>
          </div>

          <div className="font-semibold">
            <span className="text-rose-400 text-3xl">
              {fmt(Number(leaveSummary[0]?.total_leave || 0))}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-green-400">21</span>
          </div>
        </div>
        <Table className="bg-background rounded">
          <TableHeader>
            <TableRow className="bg-sidebar dark:bg-slate-900">
              <TableHead className="text-center w-14">SL No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="min-w-40">Reason</TableHead>
              {/* <TableHead className="text-center">Notified</TableHead> */}
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
                  {/* <TableCell>
                    <span
                      className={`${
                        row.notified ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {row.notified ? "Informed" : "Not Informed"}
                    </span>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </Box>
    </div>
  );
};

export default DetailLeaveSummary;
