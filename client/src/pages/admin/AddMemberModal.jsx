import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// your thunks
import { addMember, updateMember } from "@/store/member/member-slice";

const EMPTY = { name: "", email: "", position: "" };

export default function AddMemberModal({
  children,
  initialData = {},
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  titleCreate = "Add New Member",
  titleUpdate = "Update Member",
  submitCreateLabel = "Create",
  submitUpdateLabel = "Update",
}) {
  const dispatch = useDispatch();
  const isControlled = typeof controlledOpen === "boolean";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(EMPTY);

  const isEdit = useMemo(() => Boolean(initialData && initialData.id), [initialData]);
  const title = isEdit ? titleUpdate : titleCreate;
  const submitLabel = isEdit ? submitUpdateLabel : submitCreateLabel;

  // ✅ Always (re)fill when: dialog opens OR the edited item changes (by id)
  useEffect(() => {
    if (!open) return;
    setFormData({
      id: initialData?.id,
      name: initialData?.name || "",
      email: initialData?.email || "",
      position: initialData?.position || "",
    });
  }, [open, initialData?.id]); // key on id ensures switching items updates the form

  // Optional: clear state on close
  useEffect(() => {
    if (!open) {
      setFormData(EMPTY);
      setLoading(false);
    }
  }, [open]);

  const setOpen = (v) => {
    if (loading) return; // block close while submitting
    if (isControlled) onOpenChange && onOpenChange(v);
    else setUncontrolledOpen(v);
  };

  const blockWhileLoading = (e) => {
    if (loading) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.warning("Name and Email are required");
      return;
    }
    try {
      setLoading(true);
      const action = isEdit
        ? updateMember({
            id: formData.id,
            body: { name: formData.name, email: formData.email, position: formData.position },
          })
        : addMember({ name: formData.name, email: formData.email, position: formData.position });

      const result = await dispatch(action);

      if (result?.payload?.success) {
        toast.success(result.payload.message || (isEdit ? "Member updated" : "Member added"));
        onSuccess && onSuccess(result.payload?.data || result.payload);
        setOpen(false);
      } else {
        const msg =
          result?.payload?.message ||
          result?.error?.message ||
          (isEdit ? "Update failed" : "Creation failed");
        toast.error(msg);
      }
    } catch (err) {
      toast.error(err?.message || (isEdit ? "Update failed" : "Creation failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* 👇 Force a remount when switching between create/edit targets */}
      <DialogContent
        key={isEdit ? String(initialData?.id) : "create"}
        className="sm:max-w-md w-5/6 max-h-[calc(100vh-4rem)] overflow-y-auto"
        onInteractOutside={blockWhileLoading}
        onEscapeKeyDown={blockWhileLoading}
      >
        <DialogHeader>
          <DialogTitle className="text-center mb-4">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className="w-24">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="email" className="w-24">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="position" className="w-24">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position || ""}
              onChange={(e) => setFormData((s) => ({ ...s, position: e.target.value }))}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                {isEdit ? "Updating…" : "Creating…"}
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
