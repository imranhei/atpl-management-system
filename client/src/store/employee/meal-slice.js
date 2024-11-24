import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  defaultOrder: null,
  mealList: [],
  isLoading: false,
  error: null,
};

export const fetchDefaultOrder = createAsyncThunk(
  "defaultOrder/fetchDefaultOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_MONGO}/api/default-order/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDefaultOrder = createAsyncThunk(
  "defaultOrder/updateDefaultOrder",
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL_MONGO}/api/default-order/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMealItems = createAsyncThunk(
  "defaultOrder/fetchMealItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/get`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDefaultOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDefaultOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.defaultOrder = action.payload.data;
      })
      .addCase(fetchDefaultOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update default order
      .addCase(updateDefaultOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDefaultOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.defaultOrder = action.payload.data;
      })
      .addCase(updateDefaultOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch meal items
      .addCase(fetchMealItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMealItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealList = action.payload.data;
      })
      .addCase(fetchMealItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
