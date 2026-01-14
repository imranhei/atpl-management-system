import FilterModal from "@/components/admin-view/FilterModal";
import DeleteModal from "@/components/common/DeleteModal";
import { Badge } from "@/components/ui/badge";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
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
import PaginationWithEllipsis from "@/components/user-view/PaginationWithEllipsis";
import {
  fetchLeaveApplicationList,
  requestLeaveCancellation,
} from "@/store/leave/leave-slice";
import { format, isBefore, parseISO, startOfDay, subDays } from "date-fns";
import { LoaderCircle, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const typeMap = {
  full_day: "Full Day",
  "1st_half": "1st Half",
  "2nd_half": "2nd Half",
};

const canShowCancelButton = (dates) => {
  if (!dates || dates.length === 0) return false;

  // Earliest leave date
  const firstLeaveDate = parseISO(dates[0]);

  // Last allowed cancel date = leave date - 3 days
  const cancelDeadline = startOfDay(subDays(firstLeaveDate, 3));
  // Today (normalized)
  const today = startOfDay(new Date());

  return isBefore(today, cancelDeadline);
};

const ApplicationHistory = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((s) => s.auth);
  const { leaveApplicationList, pagination, isLoading, isSubmiting } =
    useSelector((s) => s.leaveApplication);
  const [params, setParams] = useState({
    id: null,
    page: 1,
    per_page: 15,
    status: null,
    leave_type: null,
  });
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    dispatch(fetchLeaveApplicationList(params));
  }, [dispatch, params]);

  const handlePageChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return (
    <div className={`sm:space-y-4 space-y-3 ${role === "admin" ? "m-4" : ""}`}>
      <div className="relative w-full sm:text-center">
        <h2 className="text-lg font-bold py-2">Application History</h2>
        <FilterModal params={params} setParams={setParams} role={role}>
          <Button className="absolute right-2 top-2">
            Filter <SlidersHorizontal />
          </Button>
        </FilterModal>
      </div>
      <Box>
        <Table className="bg-background rounded">
          {/* Table Header */}
          <TableHeader>
            <TableRow className="bg-sidebar">
              {role === "admin" && <TableHead>Name</TableHead>}
              <TableHead className="min-w-44">Date</TableHead>
              {role === "admin" && (
                <TableHead className="text-center">Notified</TableHead>
              )}
              <TableHead>Type</TableHead>
              <TableHead className="min-w-40">Reason</TableHead>
              <TableHead className="text-center">Status</TableHead>
              {role !== "admin" && (
                <TableHead className="text-center">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={role === "admin" ? 6 : 4} className="p-0">
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
              {leaveApplicationList?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={role === "admin" ? 6 : 4} className="p-0">
                    <div className="flex w-full items-center text-muted-foreground justify-center">
                      No records found.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                leaveApplicationList.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`${
                      index % 2 !== 0 ? "bg-slate-50 dark:bg-slate-900" : ""
                    }`}
                  >
                    {role === "admin" && (
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
                    {role === "admin" && (
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            row?.informed_status === "informed"
                              ? "approved"
                              : "rejected"
                          }
                        >
                          {row?.informed_status
                            ? row?.informed_status[0].toUpperCase() +
                              row.informed_status.slice(1)
                            : "-"}
                        </Badge>
                      </TableCell>
                    )}
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
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          row.status === "approved"
                            ? "approved"
                            : row.status === "pending"
                            ? "pending"
                            : "rejected"
                        }
                      >
                        {row.status[0].toUpperCase() + row.status.slice(1)}
                      </Badge>
                    </TableCell>
                    {role !== "admin" && (
                      <TableCell className="text-center">
                        {canShowCancelButton(row.date) ? (
                          <Button
                            size="sm"
                            className="py-0"
                            variant="destructive"
                            onClick={() => {
                              setSelectedLeave(row);
                              setCancelModalOpen(true);
                            }}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Badge variant="secondary">Expired</Badge>  
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </Box>

      {pagination?.last_page > 1 && (
        <PaginationWithEllipsis
          currentPage={params.page}
          totalPages={pagination?.last_page}
          onPageChange={handlePageChange}
        />
      )}

      <DeleteModal
        open={cancelModalOpen}
        onOpenChange={(isOpen) => {
          setCancelModalOpen(isOpen);

          if (!isOpen) {
            setSelectedDates([]);
          }
        }}
        loading={isSubmiting}
        title="Request Leave Cancellation"
        description="Please select which date(s) you want to request cancellation for."
        confirmText="Confirm Request"
        onConfirm={() => {
          dispatch(
            requestLeaveCancellation({
              id: selectedLeave.id,
              dates: selectedDates,
            })
          ).then(() => {
            setCancelModalOpen(false);
            setSelectedDates([]);
          });
        }}
      >
        {selectedLeave?.date?.map((d) => (
          <label key={d} className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={selectedDates.includes(d)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedDates([...selectedDates, d]);
                } else {
                  setSelectedDates(selectedDates.filter((x) => x !== d));
                }
              }}
            />
            <span>{d}</span>
          </label>
        ))}
      </DeleteModal>
    </div>
  );
};

export default ApplicationHistory;
