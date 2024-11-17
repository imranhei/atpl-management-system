import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeeklyMeals,
  createDayMeal,
  updateDayMeal,
} from "@/store/admin/day-wise-meal-slice";
import { Pencil, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initialFormState = {
  day: "",
  mealType: "",
  availableItems: [],
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const WeeklyMealManager = () => {
  const dispatch = useDispatch();
  const { weeklyMeals, mealList, isLoading, error } = useSelector(
    (state) => state.weeklyMeals
  );

  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  // const [editDayMealId, setEditDayMealId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      dispatch(updateDayMeal(formData)).then((data) => {
        if (data.payload.success) {
          dispatch(fetchWeeklyMeals());
        }
        setFormData(initialFormState);
        setIsEditing(false);
        // setEditDayMealId(null);
      });
    } else {
      dispatch(createDayMeal(formData)).then(() => {
        setFormData(initialFormState);
      });
    }
  };

  const handleEdit = (meal) => {
    const normalizedAvailableItems = meal.availableItems.map((item) => ({
      itemId: typeof item.itemId === "object" ? item.itemId._id : item.itemId,
    }));

    const temp = {
      day: meal.day,
      mealType: meal.mealType,
      availableItems: normalizedAvailableItems,
    };

    setFormData(temp);
    setIsEditing(true);
    // setEditDayMealId(meal._id);
  };

  useEffect(() => {
    dispatch(fetchWeeklyMeals());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  const handleSelectChange = (itemId) => {
    console.log("itemId", itemId);
    setFormData((prev) => {
      const exists = prev.availableItems.some((i) => i.itemId === itemId);

      // Toggle logic: Remove if exists, add if not
      const updatedItems = exists
        ? prev.availableItems.filter((i) => i.itemId !== itemId) // Remove if exists
        : [...prev.availableItems, { itemId }]; // Add if not exists

      return {
        ...prev,
        availableItems: updatedItems,
      };
    });
  };

  const removeItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      availableItems: prev.availableItems.filter((i) => i.itemId !== itemId),
    }));
  };

  return (
    <div>
      <h1 className="text-lg font-semibold pb-2">Weekly Meals</h1>
      <Table className="bg-background rounded">
        <TableHeader className="text-nowrap">
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Meal Type</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Max Quantity</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeklyMeals?.map((meal) =>
            meal.availableItems.map((item, index) => {
              const isFirstRow = index === 0; // Display the day and mealType only for the first row
              return (
                <TableRow key={item._id}>
                  {isFirstRow && (
                    <>
                      <TableCell rowSpan={meal.availableItems.length}>
                        {meal.day}
                      </TableCell>
                      <TableCell
                        rowSpan={meal.availableItems.length}
                        className="border-r"
                      >
                        {meal.mealType}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{item.itemId.itemName}</TableCell>
                  <TableCell>
                    {item.itemId.hasVariant
                      ? item.itemId.variants.join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item.itemId.hasQuantity ? item.itemId.maxQuantity : "—"}
                  </TableCell>
                  <TableCell className="text-center flex items-center gap-3 justify-center">
                    <Pencil
                      size={20}
                      className="text-green-500 cursor-pointer"
                      onClick={() => handleEdit(meal)}
                    />
                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer"
                      // Add your delete functionality here
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <form className="space-y-2 py-6" onSubmit={handleSubmit}>
        <h1 className="text-lg font-semibold pb-2">
          {isEditing ? "Update Day Wise Meal" : "Create Day Wise Meal"}
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <Label className="text-nowrap w-24">Select Day:</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, day: value }))
            }
            value={formData.day || undefined}
          >
            <SelectTrigger className="flex-1 max-w-80 cursor-pointer border border-gray-300 px-3 py-2 rounded-md bg-background">
              <SelectValue
                placeholder="Select Day"
                // value={formData.day || undefined}
              />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center mb-4">
          <Label className="text-nowrap w-24">Meal Type:</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, mealType: value }))
            }
            value={formData.mealType || undefined}
          >
            <SelectTrigger className="bg-background flex-1 max-w-80 cursor-pointer border border-gray-300 px-3 py-2 rounded-md">
              <SelectValue
                placeholder="Select Meal Type"
                // value={formData.mealType || undefined}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Lunch">Lunch</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-nowrap w-24">Select Items:</Label>
          <Select onValueChange={(value) => handleSelectChange(value)}>
            <SelectTrigger className="bg-background flex-1 max-w-80 cursor-pointer border border-gray-300 px-3 py-2 rounded-md">
              <span className="truncate">Select Items</span>
            </SelectTrigger>
            <SelectContent>
              {mealList?.map((item) => (
                <SelectItem
                  key={item._id}
                  value={item._id}
                  onClick={() => handleSelectChange(item._id)}
                  isSelected={formData.availableItems.some(
                    (i) => i.itemId === item._id
                  )}
                >
                  {item.itemName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="my-2 flex flex-wrap gap-2">
          {formData?.availableItems?.map((item) => {
            const meal = mealList.find((meal) => meal._id === item.itemId);
            return (
              <div
                key={item.itemId}
                variant="outline"
                className="flex items-center bg-gray-200 rounded border border-gray-400 gap-2 px-2 py-1 text-sm"
              >
                {meal?.itemName}
                <button
                  type="button"
                  onClick={() => removeItem(item.itemId)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
        <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
      </form>
    </div>
  );
};

export default WeeklyMealManager;
