import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  menu: {},
  defaultMeal: {},
};

export const fetchDefaultMeal = createAsyncThunk(
  "menu/fetchDefaultMeal",
  async (emp_code) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_MONGO}/default-order/get/${emp_code}`
    );
    return response.data;
  }
);

export const createDefaultMeal = createAsyncThunk(
  "menu/createDefaultMeal",
  async ({ name, emp_id, meal }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_MONGO}/default-order/create`,
      { name, emp_id, meal }
    );
    return response.data;
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultMeal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDefaultMeal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.defaultMeal = action.payload.data.meal;
      })
      .addCase(fetchDefaultMeal.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default menuSlice.reducer;
