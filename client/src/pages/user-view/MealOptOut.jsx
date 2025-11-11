import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle, PlusCircle, Trash2 } from "lucide-react";

const MealOptOut = () => {
  const [optOuts, setOptOuts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    scope: "date",
    date: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const token = localStorage.getItem("access_token");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all opt-outs
  const fetchOptOuts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/meal/opt-outs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOptOuts(res.data || []);
    } catch {
      toast.error("Failed to fetch meal opt-outs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptOuts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload =
        form.scope === "date"
          ? {
              scope: "date",
              date: form.date,
              reason: form.reason,
            }
          : {
              scope: "range",
              start_date: form.start_date,
              end_date: form.end_date,
              reason: form.reason,
            };

      await axios.post(`${API_URL}/api/meal/opt-outs/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Meal opt-out saved successfully");
      setDialogOpen(false);
      setForm({
        scope: "date",
        date: "",
        start_date: "",
        end_date: "",
        reason: "",
      });
      fetchOptOuts();
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        "Failed to create opt-out";
      toast.error(msg);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/api/meal/opt-outs/${id}/`,
        { active: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Opt-out deactivated");
      fetchOptOuts();
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  return (
    <div
      className="min-h-screen w-full 
      bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-950 dark:to-gray-900 
      p-4 flex flex-col items-center justify-start"
    >
      {/* Header */}
      <div className="text-center mb-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          🍽️ Meal Opt-Outs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your meal opt-outs (single date or date range)
        </p>
        <Button
          onClick={() => setDialogOpen(true)}
          className="mt-6 bg-amber-500 hover:bg-amber-600 text-black font-semibold flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Opt-Out
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoaderCircle size={40} className="animate-spin text-amber-500" />
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          gap-6 justify-center items-stretch mx-auto px-6"
          style={{ maxWidth: "1200px" }}
        >
          {optOuts.length > 0 ? (
            optOuts.map((opt) => (
              <div
                key={opt.id}
                className="rounded-2xl bg-gradient-to-br 
                from-gray-200/40 to-gray-100/60 
                dark:from-gray-800/50 dark:to-gray-900/70 
                border border-gray-300/60 dark:border-gray-700/60 
                shadow-md hover:shadow-xl 
                transition-all duration-300 
                hover:-translate-y-1 hover:scale-[1.03] 
                p-6 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {opt.scope === "range" ? "Range" : "Single Day"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {opt.scope === "range" ? (
                      <>
                        {opt.start_date} → {opt.end_date}
                      </>
                    ) : (
                      opt.date
                    )}
                  </p>
                  <p className="text-sm italic text-gray-700 dark:text-gray-300 mt-2">
                    💬 {opt.reason || "No reason given"}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      opt.active
                        ? "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                        : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {opt.active ? "Active" : "Inactive"}
                  </span>
                  {opt.active && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeactivate(opt.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center col-span-full mt-10">
              No opt-outs found.
            </p>
          )}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
              Add Meal Opt-Out
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            {/* Scope Selection */}
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Opt-Out Type
              </label>
              <select
                name="scope"
                value={form.scope}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              >
                <option value="date">Single Date</option>
                <option value="range">Date Range</option>
              </select>
            </div>

            {/* Conditional Inputs */}
            {form.scope === "date" ? (
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
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                    End Date
                  </label>
                  <Input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    required
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Reason
              </label>
              <Textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="e.g. On leave or training"
                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 resize-none"
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                Save Opt-Out
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealOptOut;
