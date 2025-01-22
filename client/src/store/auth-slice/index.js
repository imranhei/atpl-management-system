import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  isLoadingAuth: false,
};

export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/login`,
      data
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
    `${import.meta.env.VITE_API_URL}/api/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
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
  reducers: {
    resetTokenAndCredentials: (state) => {
      // no subdomain
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      }
    });
    builder
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoadingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoadingAuth = false;
        state.user = !action.payload?.status
          ? null
          : {
              name: action.payload?.data?.name,
              email: action.payload?.data?.email,
            };
        state.isAuthenticated = action.payload?.status;
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

export const { resetTokenAndCredentials } = authSlice.actions;

export default authSlice.reducer;
