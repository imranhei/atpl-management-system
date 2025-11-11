import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const WeeklyMeal = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const API_URL = import.meta.env.VITE_API_URL;

  // Prevent unwanted horizontal scroll
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  // 🗓️ Get Monday–Friday dates of this week
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

  // 🔄 Fetch weekly + overrides
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

      // Merge weekly & overrides logically
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
              date: localDate,
            }
          : { ...baseMeal, isOverride: false, date: localDate };
      });

      setMeals(merged);
    } catch (error) {
      toast.error("Failed to fetch weekly meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-950 dark:to-gray-900 py-16 flex flex-col items-center justify-start"
    >
      {/* Header Section */}
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

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoaderCircle size={40} className="animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="flex justify-center w-full px-6">
          {/* Five equally sized cards, same line, responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-[1400px] w-full">
            {meals.map((meal, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-br 
                from-gray-200/40 to-gray-100/60 
                dark:from-gray-800/50 dark:to-gray-900/70 
                backdrop-blur-sm border 
                border-gray-300/60 dark:border-gray-700/60 
                shadow-md hover:shadow-2xl 
                transition-all duration-300 
                hover:-translate-y-1 hover:scale-[1.03]
                p-6 flex flex-col justify-between 
                items-start text-left min-h-[250px]"
              >
                {/* Day */}
                <h3 className="text-xl font-semibold capitalize text-gray-800 dark:text-white mb-2">
                  {meal.day}
                </h3>

                {/* Meal Item */}
                <p className="text-gray-800 dark:text-gray-200 text-base mb-2">
                  {meal.item}
                </p>

                {/* Price */}
                <p className="text-amber-600 dark:text-amber-400 font-semibold text-lg">
                  ৳ {meal.price}
                </p>

                {/* Override Notice */}
                {meal.isOverride && (
                  <p className="text-xs text-amber-500 mt-2 font-medium">
                    ⚠️ Override Active ({meal.date})
                  </p>
                )}

                {/* Notes */}
                {meal.notes && (
                  <p className="text-sm italic text-gray-600 dark:text-gray-400 mt-1">
                    💬 {meal.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyMeal;
