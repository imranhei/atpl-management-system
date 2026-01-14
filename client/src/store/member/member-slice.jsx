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

export const fetchMembersPage  = createAsyncThunk(
  "members/fetchMemberList",
  async ({ page = 1, perPage = 5 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/assign/members/`,
        { params: { page, perPage } }
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
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assign/members/${employeeId}/assign-member/`,
        {
          member_id: memberId, // ✅ correct
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const assignToSignIn = createAsyncThunk(
  "members/assignToSignIn",
  async ({ employeeId, signInId }, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assign/members/${employeeId}/assign-member/`,
        {
          sign_in_id: signInId, // ✅ ONLY THIS
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const unassignTeamMember = createAsyncThunk(
  "members/unassignTeamMember",
  async ({ fieldId, memberId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assign/members/${fieldId}/unassign-user/`,
        { member_id: memberId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const unassignSignInMember = createAsyncThunk(
  "members/unassignSignInMember",
  async ({ fieldId, signInId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/assign/members/${fieldId}/unassign-user/`,
        {
          sign_in_id: signInId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
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
        state.employees = action.payload.members.results;
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
