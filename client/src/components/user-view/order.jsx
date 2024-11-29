import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDefaultOrder,
  updateDefaultOrder,
} from "@/store/employee/meal-slice";
import { placeOrder, fetchOrder, updateOrder, deleteOrder } from "@/store/employee/place-order-slice";
import OrderTable from "./orderTable";
import DefaultOrderForm from "./DefaultOrderForm";
import PlaceOrderForm from "./PlaceOrderForm";
import { getDay } from "date-fns";

const initialFormState = { day: "", mealType: "", mealItems: [] };
const newOrderFormState = { date: "", mealType: "", mealItems: [] };
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const EmployeeOrder = () => {
  const dispatch = useDispatch();
  const { defaultOrder, isLoading } = useSelector(
    (state) => state.defaultOrder
  );
  const { weeklyMeals } = useSelector((state) => state.weeklyMeals);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialFormState);
  const [newOrderFormData, setNewOrderFormData] = useState(newOrderFormState);
  const [filteredItems, setFilteredItems] = useState([]);
  const [newOrderFilteredItems, setNewOrderFilteredItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDefaultOrder(user.id));
      dispatch(fetchOrder(user.id));
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
          itemName: item?.itemId?.itemName,
          quantity: 0,
        })),
      });
      setFilteredItems([...mealsForDay.availableItems]);
    } else {
      setFormData({ ...formData, day, mealItems: [] });
      setFilteredItems([]);
    }
  };

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;

    // Map `getDay` result to weekday names
    const weekDaysMap = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = weekDaysMap[getDay(selectedDate)];

    // Fetch meals for the selected day (similar to `handleDayChange`)
    const mealsForDay = weeklyMeals.find((meal) => meal.day === day);

    if (mealsForDay) {
      setNewOrderFormData({
        ...newOrderFormData,
        date: selectedDate,
        mealType: mealsForDay.mealType,
        mealItems: mealsForDay.availableItems.map((item) => ({
          itemName: item?.itemId?.itemName || undefined,
          quantity: 0, // Default quantity
          variant: "", // Default variant
        })),
      });

      setNewOrderFilteredItems([...mealsForDay.availableItems]);
    } else {
      setNewOrderFormData({
        ...newOrderFormData,
        date: selectedDate,
        mealItems: [],
      });
      setNewOrderFilteredItems([]);
    }
  };

  const handleEdit = (order) => {
    handleDayChange(order.day);
    setFormData({
      ...order,
      mealItems: order.mealItems.map((item) => ({ ...item })),
    });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDefaultOrder({ formData, id: user?.id })).then(() => {
      dispatch(fetchDefaultOrder(user?.id));
      setFormData(initialFormState);
      setIsEditing(false);
    });
  };

  const handleNewOrderSubmit = (e) => {
    e.preventDefault();
    dispatch(placeOrder({ formData: newOrderFormData, id: user?.id })).then(() => {
      // dispatch(fetchOrder(user?.id));
      setNewOrderFormData(newOrderFormState);
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold pb-2">Default Meal Orders</h1>
      <OrderTable defaultOrder={defaultOrder} handleEdit={handleEdit} />
      <div className="flex gap-6 w-full md:flex-row flex-col">
      <DefaultOrderForm
        formData={formData}
        daysOfWeek={daysOfWeek}
        filteredItems={filteredItems}
        handleDayChange={handleDayChange}
        handleQuantityChange={(itemName, quantity) =>
          setFormData((prev) => ({
            ...prev,
            mealItems: prev.mealItems.map((item) =>
              item.itemName === itemName ? { ...item, quantity } : item
            ),
          }))
        }
        handleVariantChange={(itemName, variant, isChecked) =>
          setFormData((prev) => ({
            ...prev,
            mealItems: prev.mealItems.map((item) =>
              item.itemName === itemName
                ? { ...item, variant: isChecked ? variant : "" }
                : item
            ),
          }))
        }
        handleSubmit={handleSubmit}
        isEditing={isEditing}
      />
      <PlaceOrderForm
        newOrderFormData={newOrderFormData}
        newOrderFilteredItems={newOrderFilteredItems}
        setNewOrderFormData={setNewOrderFormData}
        handleNewOrderSubmit={handleNewOrderSubmit}
        handleDateChange={(date) => handleDateChange(date)} // Pass the new handler
        handleNewOrderQuantityChange={(itemName, quantity) =>
          setNewOrderFormData((prev) => ({
            ...prev,
            mealItems: prev.mealItems.map((item) =>
              item.itemName === itemName ? { ...item, quantity } : item
            ),
          }))
        }
        handleNewOrderVariantChange={(itemName, variant, isChecked) =>
          setNewOrderFormData((prev) => ({
            ...prev,
            mealItems: prev.mealItems.map((item) =>
              item.itemName === itemName
                ? { ...item, variant: isChecked ? variant : "" }
                : item
            ),
          }))
        }
      />
      </div>
    </div>
  );
};

export default EmployeeOrder;
