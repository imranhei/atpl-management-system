import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  employeeDetails: [],
  attendanceSummary: [],
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

export const getAttendanceSummary = createAsyncThunk(
  "employee/getAttendanceSummary",
  async ({ token, start_date, end_date, per_page }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employee/attendance-summary/`,
        {
          start_date,
          end_date,
          per_page
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
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
      })
      .addCase(getAttendanceSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendanceSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendanceSummary = action.payload;
      })
      .addCase(getAttendanceSummary.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default employeeDetailsSlice.reducer;
