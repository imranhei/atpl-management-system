import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  order: {},
  defaultMeal: {},
  id: null,
};

export const fetchDefaultMeal = createAsyncThunk(
  "menu/fetchDefaultMeal",
  async (emp_code) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_MONGO}/api/default-order/get/${emp_code}`
    );
    return response.data;
  }
);

export const createDefaultMeal = createAsyncThunk(
  "menu/createDefaultMeal",
  async ({ name, emp_id, meal }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_MONGO}/api/default-order/create`,
      { name, emp_id, meal }
    );
    return response.data;
  }
);

export const updateDefaultMeal = createAsyncThunk(
  "menu/updateDefaultMeal",
  async ({ id, meal }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL_MONGO}/api/default-order/update/${id}`,
      { meal }
    );
    return response.data;
  }
);

export const getTodayOrder = createAsyncThunk(
  "menu/getTodayOrder",
  async (emp_id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL_MONGO}/api/order/get-by-date/${emp_id}`
    );
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  "menu/createOrder",
  async ({ name, emp_id, meal, date }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_MONGO}/api/order/create`,
      { name, emp_id, meal, date }
    );
    return response.data;
  }
);

export const updateOrder = createAsyncThunk(
  "menu/updateOrder",
  async ({ id, meal, date }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL_MONGO}/api/order/update/${id}`,
      { meal, date }
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
        state.defaultMeal = action.payload.data?.meal;
        state.id = action.payload.data?._id;
      })
      .addCase(fetchDefaultMeal.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getTodayOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTodayOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.data;
      })
      .addCase(getTodayOrder.rejected, (state) => {
        state.order = {};
        state.isLoading = false;
      });
  },
});

export default menuSlice.reducer;
