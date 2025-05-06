import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  employeeDetails: [],
};

export const getEmployeeDetails = createAsyncThunk(
  "employee/getEmployeeDetails",
  async ({ token, page, per_page }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            per_page,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const employeeDetailsSlice = createSlice({
  name: "employeeDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeDetails = action.payload.data;
      })
      .addCase(getEmployeeDetails.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default employeeDetailsSlice.reducer;