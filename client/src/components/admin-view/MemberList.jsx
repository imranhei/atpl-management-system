import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddMemberModal from "@/pages/admin/AddMemberModal";
import {
  deleteMember,
  fetchEmployeeList,
  fetchMembers,
} from "@/store/member/member-slice";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteModal from "../common/DeleteModal";
import { Button } from "../ui/button";
import PaginationWithEllipsis from "../user-view/PaginationWithEllipsis";

const DEFAULT_PER_PAGE = 10;

const MemberList = ({ members = [] }) => {
  const dispatch = useDispatch();
  const { isLoading, pagination } = useSelector((state) => state.members);

  // ---- table params (single source of truth) ----
  const [params, setParams] = useState({ page: 1, per_page: DEFAULT_PER_PAGE });

  // keep employees/members in sync with params — no direct fetchMembers() elsewhere
  useEffect(() => {
    dispatch(fetchMembers(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (
      typeof pagination?.page === "number" &&
      pagination.page !== params.page
    ) {
      setParams((p) => ({ ...p, page: pagination.page }));
    }
  }, [pagination?.page]);

  const handlePageChange = (pageNum) => {
    setParams((p) => ({ ...p, page: pageNum }));
  };

  const currentPage =
    typeof pagination?.page === "number" ? pagination.page : params.page;

  const perPage = Number(
    pagination?.perPage ?? params.per_page ?? DEFAULT_PER_PAGE
  );

  // compute total pages (prefer last_page if backend gives it)
  const totalPages = useMemo(() => {
    if (pagination?.last_page) return Number(pagination.last_page);
    const total = Number(pagination?.total ?? 0);
    const per = Number(
      pagination?.perPage ?? params.per_page ?? DEFAULT_PER_PAGE
    );
    return Math.max(1, Math.ceil(total / per));
  }, [
    pagination?.last_page,
    pagination?.total,
    pagination?.perPage,
    params.per_page,
  ]);

  // Delete dialog
  const [delOpen, setDelOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Edit modal (single instance)
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAskDelete = (m) => {
    setSelected({ id: m.id, name: m.name });
    setDelOpen(true);
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    try {
      setDelLoading(true);
      await dispatch(deleteMember(selected.id)).unwrap();

      // after delete, refetch current page; if it became empty and we’re not on page 1,
      // step back one page
      await dispatch(fetchMembers(params)).unwrap();
      if ((members?.length ?? 0) <= 1 && params.page > 1) {
        setParams((p) => ({ ...p, page: p.page - 1 }));
      } else {
        // keep same page
        setParams((p) => ({ ...p }));
      }

      await dispatch(fetchEmployeeList()); // if employees depend on members
      toast.success(`${selected.name} deleted`);
    } catch (e) {
      toast.error("Failed to delete member");
    } finally {
      setDelLoading(false);
      setDelOpen(false);
      setSelected(null);
    }
  };

  const openEdit = useCallback((m) => {
    setEditing({
      id: m.id,
      name: m.name,
      email: m.email,
      position: m.position,
    });
    setEditOpen(true);
  }, []);

  const handleEditSuccess = useCallback(async () => {
    // re-fetch current page (don’t call fetchMembers() without params)
    setParams((p) => ({ ...p })); // triggers useEffect -> fetch with current params
    setEditOpen(false);
    setEditing(null);
  }, []);

  return (
    <div>
      <Card className="bg-container">
        <CardHeader className="border-b p-4">
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Manage your member pool outside the company roster.
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="py-4 text-center text-sm text-muted-foreground flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : members && members.length > 0 ? (
                  members.map((m) => (
                    <TableRow key={String(m.id)}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>{m.position}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(m)}
                        >
                          <Edit className="size-4 text-green-500 hover:text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleAskDelete(m)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No employees found.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="my-2">
              {/* Force remount when page or totalPages changes so any internal state resets */}
              <PaginationWithEllipsis
                key={`p-${params.page}-${totalPages}`}
                currentPage={params.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Single, shared Edit modal */}
      <AddMemberModal
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditing(null);
        }}
        initialData={editing || {}}
        onSuccess={handleEditSuccess}
      >
        <span style={{ display: "none" }} />
      </AddMemberModal>

      {/* Delete modal */}
      <DeleteModal
        open={delOpen}
        onOpenChange={(o) => {
          if (delLoading) return;
          setDelOpen(o);
          if (!o) setSelected(null);
        }}
        loading={delLoading}
        onConfirm={handleDelete}
        itemLabel={selected?.name}
        title="Confirm deletion"
        description={
          selected?.name
            ? `Are you sure you want to delete “${selected.name}”? You can't undo this.`
            : "Are you sure you want to delete this member? You can't undo this."
        }
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
      />
    </div>
  );
};

export default MemberList;
