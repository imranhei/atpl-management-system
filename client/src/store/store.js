import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./auth-slice"
import mealSlice from "./admin/menu-slice"
import dayWiseMealSlice from "./admin/day-wise-meal-slice"
import defaultOrderSlice from "./employee/meal-slice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        defaultOrder: defaultOrderSlice,
        meals: mealSlice,
        weeklyMeals: dayWiseMealSlice,
    },
})

export default store;