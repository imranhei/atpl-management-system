import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  menu: {},
};

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL_MONGO}/menu/get`);
  return response.data;
});

export const addMenu = createAsyncThunk("menu/addMenu", async (data) => {
    console.log(data);
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL_MONGO}/menu/add`,
    data
  );
  return response.data;
});

export const updateMenu = createAsyncThunk("menu/updateMenu", async (data) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL_MONGO}/menu/update`,
    data
  );
  return response.data;
});

export const deleteMenu = createAsyncThunk("menu/deleteMenu", async (itemName) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL_MONGO}/menu/delete/${itemName}`,
    // { params: { itemName } }
  );
  return response.data;
});

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menu = action.payload.data.meal;
      })
      .addCase(fetchMenu.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default menuSlice.reducer;