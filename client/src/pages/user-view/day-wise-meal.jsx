import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeeklyMeals,
  createDayMeal,
  updateDayMeal,
} from "@/store/admin/day-wise-meal-slice";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import { Checkbox } from "@/components/ui/checkbox";
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
      dispatch(createDayMeal(formData)).then((data) => {
        if (data.payload?.success) {
          dispatch(fetchWeeklyMeals());
        }
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

  const handleCheckboxChange = (itemId) => {
    setFormData((prev) => {
      // Check if the itemId already exists in the availableItems array
      const exists = prev.availableItems.some((item) => item.itemId === itemId);

      // Add or remove item from availableItems array
      const updatedItems = exists
        ? prev.availableItems.filter((item) => item.itemId !== itemId) // Remove
        : [...prev.availableItems, { itemId }]; // Add in required format

      return { ...prev, availableItems: updatedItems };
    });
  };

  const removeItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      availableItems: prev.availableItems.filter(
        (item) => item.itemId !== itemId
      ),
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
          {weeklyMeals?.map((meal, pIndex) =>
            meal?.availableItems?.map((item, index) => {
              const isFirstRow = index === 0; // Display merged cells only for the first row
              return (
                <TableRow key={item._id} className={`${!(pIndex%2) ? "bg-slate-50" : ""}`}>
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
                  <TableCell>{item?.itemId?.itemName}</TableCell>
                  <TableCell>
                    {item?.itemId?.hasVariant
                      ? item.itemId.variants.join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {item?.itemId?.hasQuantity ? item?.itemId?.maxQuantity : "—"}
                  </TableCell>
                  {isFirstRow && (
                    <TableCell
                      className="text-center border-l"
                      rowSpan={meal.availableItems.length}
                    >
                      <div className="flex items-center gap-3 justify-center">
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
                      </div>
                    </TableCell>
                  )}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-background flex-1 max-w-80 cursor-pointer border border-gray-300 px-3 py-2 rounded-md">
                {formData.availableItems.length
                  ? `Selected (${formData.availableItems.length})`
                  : "Select Items"} <ChevronDown size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              {mealList?.map((item) => (
                <div key={item._id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    id={item._id}
                    checked={formData.availableItems.some(
                      (selectedItem) => selectedItem.itemId === item._id
                    )}
                    onCheckedChange={() => handleCheckboxChange(item._id)}
                  />
                  <Label htmlFor={item._id}>{item.itemName}</Label>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className="my-2 flex flex-wrap gap-2">
          {formData.availableItems.map((selectedItem) => {
            const meal = mealList.find(
              (meal) => meal._id === selectedItem.itemId
            );
            return (
              <div
                key={selectedItem.itemId}
                className="flex items-center bg-gray-200 rounded border border-gray-400 gap-2 px-2 py-1 text-sm"
              >
                {meal?.itemName}
                <button
                  type="button"
                  onClick={() => removeItem(selectedItem.itemId)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
        <Button type="submit" className="sm:w-[424px]">
          {isEditing ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default WeeklyMealManager;
