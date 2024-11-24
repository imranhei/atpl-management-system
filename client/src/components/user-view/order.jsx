import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDefaultOrder,
  updateDefaultOrder,
} from "@/store/employee/meal-slice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";

const initialFormState = {
  day: "",
  mealType: "",
  mealItems: [],
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const EmployeeDefaultOrder = () => {
  const dispatch = useDispatch();
  const { defaultOrder, isLoading } = useSelector(
    (state) => state.defaultOrder
  );
  const { weeklyMeals } = useSelector((state) => state.weeklyMeals);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialFormState);
  const [filteredItems, setFilteredItems] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDefaultOrder(user.id));
    }
  }, [dispatch]);

  const handleDayChange = (day) => {
    const mealsForDay = weeklyMeals.find((meal) => meal.day === day);

    if (mealsForDay) {
      setFormData({
        ...formData,
        day,
        mealType: mealsForDay.mealType,
        mealItems: mealsForDay.availableItems.map((item) => ({
          itemName: item.itemId.itemName,
          quantity: 0,
          variant: "", // Set default variant if needed
        })),
      });

      setFilteredItems([...mealsForDay.availableItems]);
    } else {
      setFormData((prev) => ({
        ...prev,
        day,
        mealItems: [],
      }));
      setFilteredItems([]);
    }
  };

  const handleQuantityChange = (itemName, quantity) => {
    setFormData((prev) => {
      const existingItemIndex = prev.mealItems.findIndex(
        (item) => item.itemName === itemName
      );

      if (existingItemIndex !== -1) {
        // Update quantity for existing item
        const updatedMealItems = [...prev.mealItems];
        updatedMealItems[existingItemIndex].quantity = quantity;
        return { ...prev, mealItems: updatedMealItems };
      }

      // Add new item if it doesn't exist
      return {
        ...prev,
        mealItems: [...prev.mealItems, { itemName, quantity, variant: "" }],
      };
    });
  };

  const handleVariantChange = (itemName, variant, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      mealItems: prev.mealItems.map((item) => {
        if (item.itemName === itemName) {
          return {
            ...item,
            variant: isChecked ? variant : "", // Set the variant if checked, otherwise clear it
          };
        }
        return item;
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDefaultOrder({ formData, id: user?.id })).then(() => {
      dispatch(fetchDefaultOrder(user?.id));
      setFormData(initialFormState);
      setIsEditing(false);
    });
  };

  const handleEdit = (order) => {
    handleDayChange(order.day);

    // Create a deep copy of the order to avoid mutating the original object
    const editableOrder = {
      ...order,
      mealItems: order.mealItems.map((item) => ({ ...item })),
    };

    setFormData(editableOrder);
    setIsEditing(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold pb-2">Default Meal Orders</h1>
      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Meal Type</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultOrder?.map((order) => {
            return order.mealItems?.map((item, index) => {
              const isFirstRow = index === 0;
              return (
                <TableRow key={`${order.day}-${item.itemName}-${index}`}>
                  {/* Only show Day and Meal Type in the first row for each group */}
                  {isFirstRow && (
                    <>
                      <TableCell rowSpan={order.mealItems.length}>
                        {order.day}
                      </TableCell>
                      <TableCell
                        className="border-r"
                        rowSpan={order.mealItems.length}
                      >
                        {order.mealType}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.variant || "—"}</TableCell>
                  <TableCell>
                    {item.quantity > 0 ? item.quantity : "—"}
                  </TableCell>
                  {isFirstRow && (
                    <TableCell
                      rowSpan={order.mealItems.length}
                      className="text-center border-l"
                    >
                      <div className="flex items-center gap-3 justify-center">
                        <Pencil
                          size={20}
                          className="text-green-500 cursor-pointer"
                          onClick={() => handleEdit(order)}
                        />
                        {/* <Button
                          variant="destructive"
                          onClick={() => onDelete(order._id)}
                        >
                          Delete
                        </Button> */}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>

      <form className="py-6 space-y-2 max-w-96" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">
          {isEditing ? "Update Default Order" : "Create Default Order"}
        </h2>

        <div className="flex items-center gap-2">
          <Label className="w-20 text-nowrap">Select Day:</Label>
          <Select
            value={formData.day || undefined}
            onValueChange={handleDayChange}
          >
            <SelectTrigger className="flex-1 border rounded px-3 py-2">
              <SelectValue placeholder="Select Day" />
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

        {formData.day && filteredItems?.length > 0 && (
          <div className="space-y-2">
            {filteredItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 ">
                  <Label className="w-20 text-nowrap">
                    {item.itemId.itemName}
                  </Label>
                  {item.itemId.hasQuantity && item.itemId.maxQuantity > 1 && (
                    <Input
                      type="number"
                      className="flex-1"
                      value={
                        formData.mealItems.find(
                          (selected) =>
                            selected.itemName === item.itemId.itemName
                        )?.quantity || ""
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          item.itemId.itemName,
                          Number(e.target.value)
                        )
                      }
                    />
                  )}
                </div>
                {/* Row for variants */}
                {item.itemId?.hasVariant && (
                  <div className="flex flex-wrap gap-4 py-1">
                    {" "}
                    {/* Add margin for better alignment */}
                    {item.itemId.variants.map((variant) => (
                      <div key={variant} className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            formData.mealItems.find(
                              (selected) =>
                                selected.itemName === item.itemId.itemName &&
                                selected.variant === variant
                            ) !== undefined
                          }
                          onCheckedChange={(isChecked) =>
                            handleVariantChange(
                              item.itemId.itemName,
                              variant,
                              isChecked
                            )
                          }
                        />
                        <Label className="font-normal">{variant}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button type="submit" className="mt-4">
          {isEditing ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeDefaultOrder;
