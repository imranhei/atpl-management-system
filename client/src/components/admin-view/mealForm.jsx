import React from "react";
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { X } from "lucide-react";

const MealForm = ({ formData, setFormData, isEditing, onSubmit, mealList }) => {
  const handleCheckboxChange = (itemId) => {
    setFormData((prev) => {
      const exists = prev.availableItems.some((item) => item.itemId === itemId);
      const updatedItems = exists
        ? prev.availableItems.filter((item) => item.itemId !== itemId)
        : [...prev.availableItems, { itemId }];
      return { ...prev, availableItems: updatedItems };
    });
  };

  const removeItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      availableItems: prev.availableItems.filter((item) => item.itemId !== itemId),
    }));
  };

  return (
    <form
      className="space-y-2 py-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
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
          <SelectTrigger className="flex-1 max-w-80">
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              )
            )}
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
          <SelectTrigger className="flex-1 max-w-80">
            <SelectValue placeholder="Select Meal Type" />
          </SelectTrigger>
          <SelectContent>
            {["Breakfast", "Lunch", "Dinner"].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-nowrap w-24">Select Items:</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex-1 max-w-80">
              {formData.availableItems.length
                ? `Selected (${formData.availableItems.length})`
                : "Select Items"}
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
          const meal = mealList.find((meal) => meal._id === selectedItem.itemId);
          return (
            <div
              key={selectedItem.itemId}
              className="flex items-center bg-gray-200 rounded gap-2 px-2 py-1 text-sm"
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
      <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
    </form>
  );
};

export default MealForm;