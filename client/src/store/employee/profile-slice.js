import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
};

export const updateProfileData = createAsyncThunk(
  "profile/updateProfile",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profiles/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response; // Return full response, not just response.data
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("Profile updated successfully:", action);
      })
      .addCase(updateProfileData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default profileSlice.reducer;
