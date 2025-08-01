import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  createDefaultMeal,
  updateDefaultMeal,
  fetchDefaultMeal,
} from "@/store/employee/meal-slice";
import { toast } from "sonner"
import { Select } from "../ui/select";

const DefaultOrderDialogForm = ({
  isOpen,
  setIsOpen,
  menu,
  formData,
  setFormData,
  defaultMealId,
  setDefaultMealId,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleChange = (e, itemName, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [itemName]: {
        ...prevData[itemName],
        [field]: field === "quantity" ? parseInt(value, 10) || "" : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (defaultMealId) {
      dispatch(updateDefaultMeal({ id: defaultMealId, meal: formData })).then(
        (res) => {
          dispatch(fetchDefaultMeal(user.emp_code));
          if (res.payload.success) {
            toast.success("Default Order Updated");
          } else {
            toast.error("Error updating default order");
          }
          setDefaultMealId(null);
          setIsOpen(false);
        }
      );
    } else {
      dispatch(createDefaultMeal({ name: user.name, emp_id: user.emp_code, meal: formData })).then((res) => {
        dispatch(fetchDefaultMeal(user.emp_code));
        if (res.payload.success) {
          toast.success("Default Order Created");
        } else {
          toast.error("Error creating default order");
        }
        setDefaultMealId(null);
        setIsOpen(false);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Edit Default Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {Object.entries(menu).map(([itemName, itemData]) => (
            <div key={itemName} className="py-2 border-b">
              <h3 className="text-lg font-semibold mb-1">{itemName}</h3>
              {itemData.quantity && (
                <div className="flex gap-2 items-center">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Enter Quantity"
                    value={formData[itemName]?.quantity || ""}
                    onChange={(e) => handleChange(e, itemName, "quantity")}
                  />
                </div>
              )}
              {itemData.variant &&
                Array.isArray(itemData.variant) &&
                itemData.variant.length > 0 && (
                  <div className="flex gap-2 items-center">
                    <Label>Variant</Label>
                    <select
                      value={formData[itemName]?.variant || ""}
                      onChange={(e) => handleChange(e, itemName, "variant")}
                      className="p-2 border rounded"
                    >
                      <option value="">Select Variant</option>
                      {itemData.variant.map((variant, i) => (
                        <option key={i} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>
          ))}
          <Button type="submit" className="w-full mt-4">
            {defaultMealId ? "Update Default Order" : "Save Default Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DefaultOrderDialogForm;