import { Loader2 as Loader2Icon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  assignToEmployee,
  fetchEmployeeList,
  fetchMembersPage as fetchMembersPageThunk,
  unassignMember,
} from "@/store/member/member-slice";

const PER_PAGE = 10; // employees per page (table)
const BOTTOM_THRESHOLD_PX = 50; // dropdown infinite-scroll
const MIN_VISIBLE_ITEMS = 5; // dropdown infinite-scroll

const EmployeeList = ({ employees }) => {
  const dispatch = useDispatch();
  const { isLoading, pagination } = useSelector((s) => s.members);

  // ========== TABLE PAGINATION (employees) ==========
  // Local params used for fetching employee list
  const [params, setParams] = useState({ page: 1, per_page: PER_PAGE });

  // If parent already fetches employees, you can remove this effect.
  // Keeping it here ensures the table page updates when you click pagination.
  useEffect(() => {
    dispatch(fetchEmployeeList(params));
  }, [dispatch, params]);

  const handlePageChange = (pageNum) => {
    setParams((p) => ({ ...p, page: pageNum }));
  };

  // Derive totalPages: prefer API-provided last_page; else compute it.
  const totalPages =
    pagination?.last_page ??
    (pagination?.total && pagination?.perPage
      ? Math.ceil(Number(pagination.total) / Number(pagination.perPage))
      : 1);

  // ========== MEMBER SELECT (dropdown infinite list) ==========
  const [items, setItems] = useState([]); // dropdown options, paginated
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectValues, setSelectValues] = useState({}); // keep placeholder per row

  const selectContentRef = useRef(null);
  const scrollHandlerRef = useRef(null);
  const itemsRef = useRef(items);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const pageRef = useRef(page);

  useEffect(() => {
    itemsRef.current = items;
    hasMoreRef.current = hasMore;
    loadingRef.current = loading;
    pageRef.current = page;
  }, [items, hasMore, loading, page]);

  const setRowValue = (empId, value) => {
    setSelectValues((prev) => ({ ...prev, [empId]: value }));
  };

  // Load members for dropdown (infinite)
  const loadMembers = useCallback(
    async (pageNum = 1, reset = false) => {
      if (loadingRef.current) return;
      setLoading(true);
      try {
        const data = await dispatch(
          fetchMembersPageThunk({ page: pageNum, perPage: PER_PAGE })
        ).unwrap();

        const newItems = data?.members || [];

        if (reset) {
          setItems(newItems);
        } else {
          setItems((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewItems = newItems.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...prev, ...uniqueNewItems];
          });
        }

        const pg = data?.pagination || {};
        const per = Number(pg.perPage ?? PER_PAGE);
        const total = Number(pg.total ?? 0);
        const more = pageNum * per < total;
        setHasMore(more);
        setPage(pageNum + 1);

        return { newItems, hasMore: more };
      } catch (error) {
        toast.error("Failed to load members");
        return { newItems: [], hasMore: false };
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Check if dropdown viewport needs more items to become scrollable
  const checkAndLoadMoreIfNeeded = useCallback(async () => {
    if (!selectContentRef.current || loadingRef.current || !hasMoreRef.current)
      return;

    const viewport = selectContentRef.current.querySelector(
      "[data-radix-select-viewport]"
    );
    if (!viewport) return;

    const isNotScrollable = viewport.scrollHeight <= viewport.clientHeight + 1;
    const currentItems = itemsRef.current;
    const hasFewItems = currentItems.length < MIN_VISIBLE_ITEMS;

    if ((isNotScrollable || hasFewItems) && hasMoreRef.current) {
      await loadMembers(pageRef.current);
      setTimeout(() => {
        if (hasMoreRef.current) {
          checkAndLoadMoreIfNeeded();
        }
      }, 100);
    }
  }, [loadMembers]);

  // Make dropdown scrollable + infinite load on scroll
  const setupScrollListener = useCallback(() => {
    if (!selectContentRef.current) return;
    const viewport = selectContentRef.current.querySelector(
      "[data-radix-select-viewport]"
    );
    if (!viewport) return;

    // cleanup previous
    if (scrollHandlerRef.current) {
      viewport.removeEventListener("scroll", scrollHandlerRef.current);
    }

    viewport.style.maxHeight = "300px";
    viewport.style.overflowY = "auto";

    const handleScroll = () => {
      if (loadingRef.current || !hasMoreRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const atBottom =
        scrollHeight - (scrollTop + clientHeight) <= BOTTOM_THRESHOLD_PX;
      if (atBottom) loadMembers(pageRef.current);
    };

    viewport.addEventListener("scroll", handleScroll);
    scrollHandlerRef.current = handleScroll;

    return () => {
      if (viewport && scrollHandlerRef.current) {
        viewport.removeEventListener("scroll", scrollHandlerRef.current);
      }
    };
  }, [loadMembers]);

  // Handle select open/close
  const handleSelectOpen = useCallback(
    async (open) => {
      setIsSelectOpen(open);

      if (open) {
        // reset dropdown paging
        setPage(1);
        setHasMore(true);
        setItems([]);

        setTimeout(async () => {
          await loadMembers(1, true);
          setTimeout(checkAndLoadMoreIfNeeded, 100);
        }, 100);
      } else {
        // cleanup scroll listener
        if (scrollHandlerRef.current && selectContentRef.current) {
          const viewport = selectContentRef.current.querySelector(
            "[data-radix-select-viewport]"
          );
          if (viewport) {
            viewport.removeEventListener("scroll", scrollHandlerRef.current);
          }
          scrollHandlerRef.current = null;
        }
      }
    },
    [loadMembers, checkAndLoadMoreIfNeeded]
  );

  useEffect(() => {
    if (isSelectOpen && items.length > 0) {
      setTimeout(setupScrollListener, 100);
    }
  }, [isSelectOpen, items.length, setupScrollListener]);

  useEffect(() => {
    if (isSelectOpen && items.length > 0 && !loading) {
      setTimeout(checkAndLoadMoreIfNeeded, 150);
    }
  }, [isSelectOpen, items.length, loading, checkAndLoadMoreIfNeeded]);

  // Assign / Unassign
  const handleAddToTeam = (employeeId, memberId) => {
    if (!employeeId || !memberId) {
      toast.error("Invalid selection");
      return;
    }
    dispatch(assignToEmployee({ employeeId, memberId }))
      .unwrap()
      .then(() => {
        dispatch(fetchEmployeeList(params)); // refresh same page
        toast.success("Member added to employee");
        setRowValue(employeeId, "");
      })
      .catch(() => toast.error("Failed to add member to employee"));
  };

  const handleRemoveFromTeam = (employeeId, memberId) => {
    if (!employeeId || !memberId) {
      toast.error("Invalid selection");
      return;
    }
    dispatch(unassignMember({ employeeId, memberId }))
      .unwrap()
      .then(() => {
        dispatch(fetchEmployeeList(params));
        toast.success("Member removed from employee");
      })
      .catch(() => toast.error("Failed to remove member from employee"));
  };

  // Helpers
  const getAvailableMembers = useCallback(
    (employee) => {
      const assignedMembers = employee?.members ?? [];
      return items.filter(
        (member) =>
          !assignedMembers.some((assigned) => assigned.id === member.id)
      );
    },
    [items]
  );

  // Render rows
  const renderTableRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <div className="py-4 text-center text-sm text-muted-foreground flex items-center justify-center">
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (!employees?.length) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <div className="py-8 text-center text-sm text-muted-foreground">
              No employees found.
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return employees.map((employee) => {
      const empId = employee?.user?.id ?? employee?.id;
      const availableMembers = getAvailableMembers(employee);

      return (
        <TableRow key={empId}>
          <TableCell className="font-medium">
            {employee?.user?.username
              ? employee.user.username.charAt(0).toUpperCase() +
                employee.user.username.slice(1).toLowerCase()
              : ""}
          </TableCell>
          <TableCell>{employee?.user?.email}</TableCell>
          <TableCell>{employee?.user?.position}</TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {employee?.members?.map((member) => (
                <Badge
                  key={member?.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {member.name}
                  <button
                    onClick={() => handleRemoveFromTeam(empId, member.id)}
                    className="ml-1 hover:text-red-500"
                    aria-label={`Remove ${member.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </TableCell>

          <TableCell>
            <Select
              value={selectValues[empId] ?? ""}
              onOpenChange={handleSelectOpen}
              onValueChange={(memberId) => handleAddToTeam(empId, memberId)}
            >
              <SelectTrigger className="w-36 h-8 data-[placeholder]:text-muted-foreground">
                <SelectValue placeholder="Add member" />
              </SelectTrigger>

              <SelectContent ref={selectContentRef} position="popper">
                {availableMembers.map((member) => (
                  <SelectItem key={String(member.id)} value={String(member.id)}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-gray-200 truncate">
                            {member.name}
                          </span>
                          {member.position && (
                            <Badge
                              variant="secondary"
                              className="ml-2 text-xs font-normal bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                            >
                              {member.position}
                            </Badge>
                          )}
                        </div>
                  </SelectItem>
                ))}

                {/* Loading/Status footer */}
                <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />
                      Loading…
                    </div>
                  ) : hasMore ? (
                    availableMembers.length > 0 ? (
                      "Scroll to load more"
                    ) : (
                      "Loading more items..."
                    )
                  ) : availableMembers.length > 0 ? (
                    "End of list"
                  ) : (
                    "No members available"
                  )}
                </div>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Card className="bg-container">
      <CardHeader className="border-b p-4">
        <CardTitle>Employees</CardTitle>
        <CardDescription>
          A list of all employees in your organization with their team
          assignments.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="bg-background">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Add Team Member</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="my-2">
            <PaginationWithEllipsis
              currentPage={params.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
