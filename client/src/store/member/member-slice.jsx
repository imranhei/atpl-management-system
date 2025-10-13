import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  members: [],
  employees: [],
  isLoading: false,
  actionLoading: false,
  pagination: null,
  error: null,
};

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/assign/members/`,
        { params }
      );
      // ✅ return only serializable data
      return res.data;
    } catch (err) {
      // ✅ make the rejection payload serializable & consistent
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/assign/members/${id}/`,
        body
      );
      return res.data; // ✅ serializable
    } catch (err) {
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const fetchEmployeeList = createAsyncThunk(
  "members/fetchEmployeeList",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/assign/users/members/`,
        { params }
      );
      return res.data; // ✅ serializable
    } catch (err) {
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assign/members/`,
        data
      );
      return res.data; // ✅ serializable
    } catch (err) {
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assign/members/${id}/delete/`
      );
      return res.data; // ✅ serializable
    } catch (err) {
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const assignToEmployee = createAsyncThunk(
  "members/assignToEmployee",
  async ({ employeeId, memberId }, { rejectWithValue }) => {
    console.log("assignToEmployee", { employeeId, memberId });
    try {
      const res = await axios.post(
        // 👇 memberId in the path
        `${
          import.meta.env.VITE_API_URL
        }/api/assign/members/${memberId}/assign-user/`,
        // 👇 user/employee id in JSON body (rename key if your API expects a different name)
        { user_id: employeeId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data; // ✅ serializable
    } catch (err) {
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const unassignMember = createAsyncThunk(
  "members/unassignMember",
  async ({ employeeId, memberId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/assign/members/${memberId}/unassign-user/`,
        { user_id: employeeId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data; // ✅ serializable
    } catch (err) {
      const payload = err?.response?.data ?? {
        message: err?.message || "Request failed",
      };
      return rejectWithValue(payload);
    }
  }
);

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload.members;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployeeList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployeeList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addMember.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.members.push(action.payload.member);
      })
      .addCase(addMember.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export default memberSlice.reducer;
export const { reducer: memberReducer } = memberSlice;
