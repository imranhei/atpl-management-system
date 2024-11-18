import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  weeklyMeals: [], // All meals for the week
  mealList: [], // List of all meal items
  isLoading: false,
  error: null,
};

export const fetchWeeklyMeals = createAsyncThunk(
  "meals/fetchWeeklyMeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/day-wise-meals/week`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDayMeals = createAsyncThunk(
  "meals/fetchDayMeals",
  async (day, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/day-wise-meals`,
        { params: { day } }
      );
      return { day, meals: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDayMeal = createAsyncThunk(
  "meals/createDayMeal",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/day-wise-meals`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDayMeal = createAsyncThunk(
  "meals/updateDayMeal",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/day-wise-meals`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const mealSlice = createSlice({
  name: "weeklyMeals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeeklyMeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWeeklyMeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weeklyMeals = action.payload.data.weeklyMeals;
        state.mealList = action.payload.data.allMealItems;
      })
      .addCase(fetchWeeklyMeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createDayMeal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDayMeal.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.weeklyMeals.push(action.payload.data);
      })
      .addCase(createDayMeal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default mealSlice.reducer;
