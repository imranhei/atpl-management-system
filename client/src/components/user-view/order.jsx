import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchDefaultMeal, getTodayOrder } from "@/store/employee/meal-slice";
// import { fetchMenu } from "@/store/admin/menu-slice";
import DefaultOrderTable from "./defaultOrderTable";
import TodayOrderTable from "./todayOrderTable";
import OrderDialogForm from "./orderDialogForm";
import DefaultOrderDialogForm from "./defaultOrderDialogForm";
import { Separator } from "../ui/separator";

const EmployeeOrder = () => {
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewOrderDialog, setIsNewOrderDialog] = useState(false);
  const [defaultMealId, setDefaultMealId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { menu } = useSelector((state) => state.menu);
  const { defaultMeal = {}, id, order } = useSelector((state) => state.meal);

  // Fetch menu and default meal data on component mount
  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchDefaultMeal(user.emp_code));
  //     dispatch(getTodayOrder(user.emp_code));
  //   }
  //   dispatch(fetchMenu());
  // }, [dispatch, user]);

  const openEditDialog = () => {
    // Set initial formData from defaultMeal and then open the dialog
    setFormData(
      Object.keys(menu).reduce((acc, item) => {
        acc[item] = defaultMeal[item] || { quantity: "", variant: "" };
        return acc;
      }, {})
    );
    setDefaultMealId(id);
    setIsDialogOpen(true);
  };

  const openNewOrderDialog = () => {
    // Set initial formData from today's order and then open the dialog
    setFormData({
      ...Object.keys(menu).reduce((acc, item) => {
        acc[item] = order.meal?.[item] || { quantity: "", variant: "" };
        return acc;
      }, {}),
      date: order.date ? order.date.split("T")[0] : "", // Include date
    });
    setOrderId(order._id);
    setIsNewOrderDialog(true);
  };

  return (
    <div className="flex-1 space-y-4 mt-6">
      <h1 className="font-semibold">Default Order</h1>
      {/* <DefaultOrderTable 
        defaultMeal={defaultMeal} 
        openEditDialog={openEditDialog}
      />
      <Separator />
      <TodayOrderTable 
        order={order} 
        openNewOrderDialog={openNewOrderDialog}
      />
      <OrderDialogForm 
        isOpen={isNewOrderDialog} 
        setIsOpen={setIsNewOrderDialog} 
        menu={menu} 
        formData={formData} 
        setFormData={setFormData}
        orderId={orderId}
        setOrderId={setOrderId}
      />
      <DefaultOrderDialogForm 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        menu={menu} 
        formData={formData} 
        setFormData={setFormData}
        defaultMealId={defaultMealId}
        setDefaultMealId={setDefaultMealId}
      /> */}
    </div>
  );
};

export default EmployeeOrder;