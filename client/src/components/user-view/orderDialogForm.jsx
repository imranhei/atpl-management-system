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
  createOrder,
  updateOrder,
  getTodayOrder,
} from "@/store/employee/meal-slice";
import { useToast } from "@/hooks/use-toast";

const OrderDialogForm = ({
  isOpen,
  setIsOpen,
  menu,
  formData,
  setFormData,
  orderId,
  setOrderId,
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
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

    const { date, ...meal } = formData;

    if (orderId) {
      dispatch(updateOrder({ id: orderId, date, meal })).then((res) => {
        dispatch(getTodayOrder(user.emp_code));
        if (res.payload.success) {
          toast({
            title: "Order Updated",
          });
        } else {
          toast({
            title: "Error updating order",
            variant: "destructive",
          });
        }
        setOrderId(null);
        setIsOpen(false);
      });
    } else {
      dispatch(createOrder({ name: user.name, emp_id: user.emp_code, date, meal })).then((res) => {
        dispatch(getTodayOrder(user.emp_code));
        if (res.payload.success) {
          toast({
            title: "Order Placed",
          });
        } else {
          toast({
            title: "Error placing order",
            variant: "destructive",
          });
        }
        setOrderId(null);
        setIsOpen(false);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {Object.entries(menu).map(([itemName, itemData]) => (
            <div key={itemName} className="py-2 border-b">
              <h3 className="text-lg font-semibold mb-2">{itemName}</h3>
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
          <div className="flex items-center w-full gap-2 my-2">
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            {orderId ? "Update Order" : "Place Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialogForm;