import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  attendance: [],
};

export const getAttendance = createAsyncThunk(
  "attendance/getAttendance",
  async ({ token, page, per_page, start_date, end_date }) => {
    try {
      const params = {
        page,
        per_page,
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee/daily-punches/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params, // Pass the date range and page parameters
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendance = action.payload;
      })
      .addCase(getAttendance.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default attendanceSlice.reducer;
