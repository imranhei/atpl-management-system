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
import { deleteMember, fetchMembers, fetchEmployeeList } from "@/store/member/member-slice";
import { Edit, Loader2Icon, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteModal from "../common/DeleteModal";
import { Button } from "../ui/button";

const MemberList = ({ members = [] }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.members);

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
      await dispatch(fetchMembers());
      await dispatch(fetchEmployeeList());
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
    await dispatch(fetchMembers());
    setEditOpen(false);
    setEditing(null);
  }, [dispatch]);

  return (
    <div>
      <Card>
        <CardHeader className="border-b p-4">
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Manage your member pool outside the company roster.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
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
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : members && members.length > 0 ? (
                  members?.map((m) => (
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
        </CardContent>
      </Card>

      {/* Single, shared Edit modal (mounted once) */}
      <AddMemberModal
        open={editOpen}
        onOpenChange={(o) => {
          // don’t lose data mid-edit unless explicitly closed
          setEditOpen(o);
          if (!o) setEditing(null);
        }}
        initialData={editing || {}}
        onSuccess={handleEditSuccess}
      >
        {/* Hidden trigger because we open it programmatically */}
        <span style={{ display: "none" }} />
      </AddMemberModal>

      {/* Delete modal */}
      <DeleteModal
        open={delOpen}
        onOpenChange={(o) => {
          if (delLoading) return; // block while deleting
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
