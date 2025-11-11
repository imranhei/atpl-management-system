import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LoaderCircle, Pencil } from "lucide-react";
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

const WeeklyMeal = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [form, setForm] = useState({ item: "", price: "", notes: "", date: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const token = localStorage.getItem("access_token");
  const API_URL = import.meta.env.VITE_API_URL;

  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const [weeklyRes, overrideRes] = await Promise.all([
        axios.get(`${API_URL}/api/meal/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/meal/override/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const weekly = weeklyRes.data?.members || [];
      const overrides = overrideRes.data || [];
      const weekDates = getWeekDates();

      const merged = weekDates.map((dateObj) => {
        const dayName = dateObj
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();
        const localDate = dateObj.toLocaleDateString("en-CA");

        const baseMeal =
          weekly.find((m) => m.day.toLowerCase() === dayName) || {
            day: dayName,
            item: "—",
            price: "—",
          };

        const override = overrides.find((o) => o.date === localDate);

        return override
          ? {
              ...baseMeal,
              item: override.item,
              price: override.price,
              notes: override.notes,
              isOverride: true,
              overrideId: override.id,
              date: localDate,
            }
          : { ...baseMeal, isOverride: false, date: localDate };
      });

      setMeals(merged);
    } catch {
      toast.error("Failed to fetch weekly meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const openEdit = (meal) => {
    setEditingMeal(meal);
    setForm({
      item: meal.item,
      price: meal.price,
      notes: meal.notes || "",
      date: meal.date,
    });
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingMeal.isOverride) {
        await axios.put(
          `${API_URL}/api/meal/override/${editingMeal.overrideId}/`,
          {
            date: form.date,
            item: form.item,
            price: parseFloat(form.price),
            notes: form.notes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Override updated successfully");
      } else {
        await axios.put(
          `${API_URL}/api/meal/${editingMeal.id}/`,
          {
            item: form.item,
            price: parseFloat(form.price),
            day: editingMeal.day,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Weekly meal updated successfully");
      }
      setDialogOpen(false);
      fetchMeals();
    } catch {
      toast.error("Failed to update meal");
    }
  };

  return (
    <div
      className="min-h-screen w-full 
      bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-950 dark:to-gray-900 
      py-16 flex flex-col items-center justify-start"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          🍱 Weekly Meal Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Showing meals for this week (
          {getWeekDates()[0].toDateString()} →{" "}
          {getWeekDates()[4].toDateString()})
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoaderCircle size={40} className="animate-spin text-amber-500" />
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 
          gap-6 justify-center items-stretch mx-auto"
          style={{
            maxWidth: "1100px", // ✅ keeps all 5 centered
          }}
        >
          {meals.map((meal, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br 
              from-gray-200/40 to-gray-100/60 
              dark:from-gray-800/50 dark:to-gray-900/70 
              border border-gray-300/60 dark:border-gray-700/60 
              shadow-md hover:shadow-xl 
              transition-all duration-300 
              hover:-translate-y-1 hover:scale-[1.03] 
              p-6 flex flex-col justify-between 
              min-h-[260px]" // ✅ equal height
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold capitalize text-gray-800 dark:text-white">
                  {meal.day}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(meal)}
                  className="text-gray-600 hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400"
                >
                  <Pencil size={18} />
                </Button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-800 dark:text-gray-200 mt-2 text-base">
                  {meal.item}
                </p>
                <p className="text-amber-600 dark:text-amber-400 font-semibold mt-1">
                  ৳ {meal.price}
                </p>
                {meal.notes && (
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-2">
                    💬 {meal.notes}
                  </p>
                )}
              </div>

              {meal.isOverride && (
                <p className="text-xs text-amber-500 mt-2 font-medium">
                  ⚠️ Override Active
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Popup Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
              {editingMeal?.isOverride
                ? "Edit Override Meal"
                : `Edit ${editingMeal?.day}'s Meal`}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            {!editingMeal?.isOverride && (
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                  Day
                </label>
                <Input
                  type="text"
                  value={editingMeal?.day || ""}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed"
                />
              </div>
            )}

            {editingMeal?.isOverride && (
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
            )}

            <div>
              <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                Meal Item
              </label>
              <Input
                name="item"
                value={form.item}
                onChange={handleChange}
                required
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

            {editingMeal?.isOverride && (
              <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                  Notes
                </label>
                <Textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="e.g. VIP guest today"
                  className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 resize-none"
                />
              </div>
            )}

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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyMeal;
