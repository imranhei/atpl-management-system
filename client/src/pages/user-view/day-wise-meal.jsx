import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeeklyMeals,
  createDayMeal,
  updateDayMeal,
} from "@/store/admin/day-wise-meal-slice";
import WeeklyMealTable from "@/components/admin-view/WeeklyMealTable";
import MealForm from "@/components/admin-view/mealForm";

const WeeklyMealManager = () => {
  const dispatch = useDispatch();
  const { weeklyMeals, mealList, isLoading, error } = useSelector(
    (state) => state.weeklyMeals
  );

  const [formData, setFormData] = useState({
    day: "",
    mealType: "",
    availableItems: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchWeeklyMeals());
  }, [dispatch]);

  const handleEdit = (meal) => {
    const normalizedAvailableItems = meal.availableItems.map((item) => ({
      itemId: typeof item.itemId === "object" ? item.itemId._id : item.itemId,
    }));
    setFormData({
      day: meal.day,
      mealType: meal.mealType,
      availableItems: normalizedAvailableItems,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (formData) => {
    if (isEditing) {
      dispatch(updateDayMeal(formData)).then((data) => {
        setIsEditing(false);
        if (data?.payload?.success) {
          dispatch(fetchWeeklyMeals());
        }
      });
    } else {
      dispatch(createDayMeal(formData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchWeeklyMeals());
        }
      });
    }
    dispatch(fetchWeeklyMeals());
    setFormData({ day: "", mealType: "", availableItems: [] });
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-lg font-semibold pb-2">Weekly Meals</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <WeeklyMealTable weeklyMeals={weeklyMeals} onEdit={handleEdit} />
          <MealForm
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            mealList={mealList}
          />
        </>
      )}
    </div>
  );
};

export default WeeklyMealManager;