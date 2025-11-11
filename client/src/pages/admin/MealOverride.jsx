import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MealOverride = () => {
  const [overrides, setOverrides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    date: "",
    item: "",
    price: "",
    notes: "",
  });

  const API_URL = `${import.meta.env.VITE_API_URL}/api/meal/override/`;
  const token = localStorage.getItem("access_token");

  // Fetch Overrides (sorted newest → oldest)
  const fetchOverrides = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setOverrides(sorted);
    } catch {
      toast.error("Failed to fetch meal overrides");
    } finally {
      setLoading(false);
    }
  };

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Edit Override
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editing;
    const method = isEditing ? "put" : "post";
    const url = isEditing ? `${API_URL}${editing.id}/` : API_URL;

    try {
      const res = await axios[method](url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success(isEditing ? "Override updated" : "Override created");
        setOpenDialog(false);
        fetchOverrides();
        setEditing(null);
        setForm({ date: "", item: "", price: "", notes: "" });
      } else toast.error("Something went wrong");
    } catch {
      toast.error("Error submitting override");
    }
  };

  // Confirm Delete
  const confirmDelete = (id) => {
    setDeleteTarget(id);
    setConfirmDialog(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await axios.delete(`${API_URL}${deleteTarget}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 || res.status === 204) {
        toast.success("Override deleted");
        fetchOverrides();
      }
    } catch {
      toast.error("Failed to delete override");
    } finally {
      setConfirmDialog(false);
      setDeleteTarget(null);
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      date: item.date,
      item: item.item,
      price: item.price,
      notes: item.notes || "",
    });
    setOpenDialog(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ date: "", item: "", price: "", notes: "" });
    setOpenDialog(true);
  };

  useEffect(() => {
    fetchOverrides();
  }, []);

  return (
    <div
      className="min-h-screen p-4 
      bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-950 dark:to-gray-900 transition-colors duration-500"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              🍛 Meal Overrides
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Manage special-day meal changes.
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            <Plus size={18} className="mr-2" /> Add Override
          </Button>
        </div>

        {/* Cards */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            Loading overrides...
          </p>
        ) : overrides.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            No override meals found.
          </p>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {overrides.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl bg-gradient-to-br 
                           from-gray-200/40 to-gray-100/60 
                           dark:from-gray-800/50 dark:to-gray-900/70 
                           backdrop-blur-sm border 
                           border-gray-300/60 dark:border-gray-700/60 
                           shadow-md hover:shadow-2xl 
                           transition-all duration-300 
                           hover:-translate-y-1 hover:scale-[1.03] 
                           p-5 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {new Date(o.date).toDateString()}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {o.item}
                    </p>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold mt-2">
                      ৳ {o.price}
                    </p>
                    {o.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {o.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(o)}
                      className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(o.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {editing ? "✏️ Edit Override" : "➕ Add Override"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Date
              </label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Meal Item
              </label>
              <Input
                name="item"
                value={form.item}
                onChange={handleChange}
                required
                placeholder="Enter meal item"
                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Price (৳)
              </label>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Notes
              </label>
              <Textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Optional notes (e.g., VIP guest today)"
                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 resize-none"
              />
            </div>
            <DialogFooter className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {editing ? "Save Changes" : "Create Override"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🗑️ Custom Confirm Delete Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-red-500">
              <AlertTriangle size={20} /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Are you sure you want to delete this override? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(false)}
              className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealOverride;
