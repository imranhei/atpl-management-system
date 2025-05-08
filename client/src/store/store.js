import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import mealSlice from "./admin/menu-slice";
import dayWiseMealSlice from "./admin/day-wise-meal-slice";
import defaultOrderSlice from "./employee/meal-slice";
import leaveSlice from "./leave/leave-slice";
import placeOrderSlice from "./employee/place-order-slice";
import attendanceSlice from "./employee/attendance-slice";
import employeeDetailsSlice from "./admin/employee-details-slice";
import profileSlice from "./employee/profile-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    defaultOrder: defaultOrderSlice,
    meals: mealSlice,
    weeklyMeals: dayWiseMealSlice,
    leaveApplication: leaveSlice,
    placeOrder: placeOrderSlice,
    attendance: attendanceSlice,
    employeeDetails: employeeDetailsSlice,
    profile: profileSlice,
  },
});

export default store;
