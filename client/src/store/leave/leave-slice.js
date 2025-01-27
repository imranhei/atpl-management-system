import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  defaultLeaveData: null,
  leaveApplicationList: [],
  isLoading: false,
  error: null,
};

// Add a new meal
export const addLeaveApplication = createAsyncThunk(
  "defaultLeaveData/addLeaveApplication",
  async (mealData, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    const parsedToken = JSON.parse(token);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/records`,
        mealData,
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
          },
        }
      );
      return response.data; // Assumes response.data contains the added leave application
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while adding a leave application."
      );
    }
  }
);

export const fetchLeaveApplicationList = createAsyncThunk(
  "defaultLeaveData/fetchLeaveApplicationList",
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem("token");
    const parsedToken = JSON.parse(token);

    try {
      // const queryString = params
      //   ? `?${new URLSearchParams(params).toString()}`
      //   : "";
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/records`,
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "An error occurred while fetching the leave application list."
      );
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add a new leave application
      .addCase(addLeaveApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addLeaveApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.defaultLeaveData = action.payload.results;
      })
      .addCase(addLeaveApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch leave application list
      .addCase(fetchLeaveApplicationList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaveApplicationList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveApplicationList = action.payload.results;
      })
      .addCase(fetchLeaveApplicationList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default leaveSlice.reducer;
