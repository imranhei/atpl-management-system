import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./auth-slice"
import menuSlice from "./admin/menu-slice"
import mealSlice from "./employee/meal-slice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        menu: menuSlice,
        meal: mealSlice,
    },
})

export default store;