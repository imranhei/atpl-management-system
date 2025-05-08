import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  profile: {},
};

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async ({ token, emp_code }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee/profile/${emp_code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "profile/updateProfile",
  async ({ token, formData }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profiles/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const updateProfileData = createAsyncThunk(
  "profile/updateProfile",
  async ({ token, formData }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profiles/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default profileSlice.reducer;