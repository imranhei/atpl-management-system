import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  defaultLeaveData: null,
  leaveApplicationList: [],
  details: [],
  leaveSummary: [],
  isLoading: false,
  isSubmiting: false,
  pagination: null,
  error: null,
};

export const addLeaveApplication = createAsyncThunk(
  "defaultLeaveData/addLeaveApplication",
  async (data, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/leave/apply/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assumes response.data contains the added leave application
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.reason[0] ||
          "An error occurred while adding a leave application."
      );
    }
  }
);

export const fetchLeaveApplicationList = createAsyncThunk(
  "defaultLeaveData/fetchLeaveApplicationList",
  async (params, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/leave/list/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
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

export const fetchLeaveSummary = createAsyncThunk(
  "defaultLeaveData/fetchLeaveSummary",
  async (params = {}, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/leave/summary/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
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

export const ManuallyAddLeave = createAsyncThunk(
  "defaultLeaveData/ManuallyAddLeave",
  async (data, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/leave/manual/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Assumes response.data contains the added leave application
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.reason[0] ||
          "An error occurred while adding a leave application."
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
        state.isSubmiting = true;
      })
      .addCase(addLeaveApplication.fulfilled, (state, action) => {
        state.isSubmiting = false;
      })
      .addCase(addLeaveApplication.rejected, (state, action) => {
        state.isSubmiting = false;
        state.error = action.payload;
      })

      // Fetch leave application list
      .addCase(fetchLeaveApplicationList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaveApplicationList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveApplicationList = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeaveApplicationList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaveSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaveSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveSummary = action.payload.results;
        state.details = action.payload.results[0].details;
      })
      .addCase(fetchLeaveSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default leaveSlice.reducer;
