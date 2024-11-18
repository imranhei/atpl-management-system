import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDefaultOrder,
  updateDefaultOrder,
  fetchMealItems,
} from "@/store/employee/meal-slice";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const EmployeeDefaultOrder = () => {
  const dispatch = useDispatch();
  const { defaultOrder, mealList, isLoading, error } = useSelector((state) => state.defaultOrder);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    itemId: "",
    variant: "",
    quantity: 1,
  });

  useEffect(() => {
    dispatch(fetchMealItems());
    if (user) dispatch(fetchDefaultOrder(user.id));
  }, [dispatch]);

  useEffect(() => {
    if (defaultOrder) {
      setFormData({
        itemId: defaultOrder.itemId?._id || "",
        variant: defaultOrder.variant || "",
        quantity: defaultOrder.quantity || 1,
      });
    }
  }, [defaultOrder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDefaultOrder(formData));
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Default Order</h1>

      {/* Display Current Default Order */}
      {defaultOrder && (
        <div className="p-4 bg-gray-100 rounded border mb-4">
          <h2 className="font-medium mb-2">Current Default Order:</h2>
          <p>
            <strong>Item:</strong> {defaultOrder.itemId?.itemName || "None"}
          </p>
          {defaultOrder.variant && (
            <p>
              <strong>Variant:</strong> {defaultOrder.variant}
            </p>
          )}
          <p>
            <strong>Quantity:</strong> {defaultOrder.quantity}
          </p>
        </div>
      )}

      {/* Form to Update Default Order */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <Label>Select Meal Item:</Label>
          <Select
            onValueChange={(value) => handleChange("itemId", value)}
            value={formData.itemId}
          >
            <SelectTrigger className="bg-background border border-gray-300 rounded-md">
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent>
              {mealList.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.itemName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show Variant Dropdown if Meal Item Has Variants */}
        {mealList.find((item) => item._id === formData.itemId)?.hasVariant && (
          <div className="flex flex-col">
            <Label>Select Variant:</Label>
            <Select
              onValueChange={(value) => handleChange("variant", value)}
              value={formData.variant}
            >
              <SelectTrigger className="bg-background border border-gray-300 rounded-md">
                <SelectValue placeholder="Select Variant" />
              </SelectTrigger>
              <SelectContent>
                {mealList
                  .find((item) => item._id === formData.itemId)
                  ?.variants.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity Input */}
        {mealList.find((item) => item._id === formData.itemId)?.hasQuantity && (
          <div className="flex flex-col">
            <Label>Quantity:</Label>
            <Input
              type="number"
              min="1"
              max={
                mealList.find((item) => item._id === formData.itemId)
                  ?.maxQuantity || 10
              }
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </div>
        )}

        <Button type="submit" className="mt-4">
          Save Default Order
        </Button>
      </form>
    </div>
  );
};

export default EmployeeDefaultOrder;