import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  isLoadingAuth: false,
  role: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.error || error.message || "Unknown error",
      });
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const registerUser = createAsyncThunk("/auth/register", async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/register`,
      data
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

export const checkAuth = createAsyncThunk("/auth/checkauth", async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/dashboard/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
});

export const deleteUser = createAsyncThunk("/auth/deleteUser", async (id) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/auth/delete/${id}`
  );
  return response.data;
});

export const resetPassword = createAsyncThunk(
  "/auth/resetPassword",
  async (data) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
      data
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.isAuthenticated = true;
          if (
            action.payload.user.username === "frahman" ||
            action.payload.user.username === "faisal"
          ) {
            state.role = "admin";
          }
        }
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoadingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoadingAuth = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          if (
            action.payload.user.username === "frahman" ||
            action.payload.user.username === "faisal"
          ) {
            state.role = "admin";
          }
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoadingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
