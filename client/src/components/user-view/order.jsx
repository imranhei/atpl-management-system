import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDefaultOrder,
  updateDefaultOrder,
} from "@/store/employee/meal-slice";
import {
  placeOrder,
  fetchOrder,
  updateOrder,
  deleteOrder,
} from "@/store/employee/place-order-slice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OrderTable from "./orderTable";
import DefaultOrderForm from "./defaultOrderForm";
import PlaceOrderForm from "./placeOrderForm";
import { getDay } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

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
  const [date, setDate] = useState({
    from: null,
    to: null,
  });

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
    dispatch(placeOrder({ formData: newOrderFormData, id: user?.id })).then(
      () => {
        // dispatch(fetchOrder(user?.id));
        setNewOrderFormData(newOrderFormState);
      }
    );
  };

  const handleMealOff = () => {
    if (date?.from && date?.to) {
      // Generate an array of dates between 'from' and 'to'
      const startDate = new Date(date.from);
      const endDate = new Date(date.to);

      // Create an array of dates in the desired format
      const formattedDates = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        formattedDates.push(format(currentDate, "yyyy-MM-dd")); // Format to "YYYY-MM-DD"
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1)); // Increment by 1 day
      }
    } else if (date?.from) {
      // If only 'from' is selected (single date)
      const formattedDate = [format(new Date(date.from), "yyyy-MM-dd")];
    } else {
      console.log("No date selected");
    }
  };

  const handleDayDelete = (tag) => {
    console.log(tag);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold pb-2">Default Meal Orders</h1>
        {/* <Button>Update Meal Off Date</Button> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Update Meal Off Date</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Meal Off Date</DialogTitle>
              <DialogDescription>
                Update your meal off date to skip meals for a specific day/days.
              </DialogDescription>
            </DialogHeader>
            <div>
              <h1 className="mb-2">Selected meal off days</h1>
              <ScrollArea className="h-40 w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Day off
                  </h4>
                  {tags.map((tag) => (
                    <div key={tag}>
                      <div className="text-sm flex justify-between">
                        <p>{tag}</p>
                        <X
                          size={16}
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDayDelete(tag)}
                        />
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4" />
              <p>Set a day off</p>
              <div className="mt-2">
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* <Button onClick={() => console.log(date)}>Submit</Button> */}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleMealOff}>
                Update Date
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
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
