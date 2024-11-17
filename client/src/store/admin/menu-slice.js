import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  meals: [],
};

// Fetch all meals
export const fetchMeals = createAsyncThunk(
  "meals/fetchMeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/get`
      );
      return response.data; // Assumes response.data contains the meals
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching meals."
      );
    }
  }
);

// Add a new meal
export const addMeal = createAsyncThunk(
  "meals/addMeal",
  async (mealData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/add`,
        mealData
      );
      return response.data; // Assumes response.data contains the added meal
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while adding a meal."
      );
    }
  }
);

// Update an existing meal
export const updateMeal = createAsyncThunk(
  "meals/updateMeal",
  async ({ formData, _id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/update/${_id}`,
        formData
      );
      return response.data; // Assumes response.data contains the updated meal
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while updating the meal."
      );
    }
  }
);

// Delete a meal
export const deleteMeal = createAsyncThunk(
  "meals/deleteMeal",
  async (mealId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL_MONGO}/api/meals/delete/${mealId}`
      );
      return { mealId }; // Returning the deleted meal ID for state updates
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "An error occurred while deleting the meal."
      );
    }
  }
);

// Slice for meal management
const mealSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {}, // Reducers for synchronous state updates if needed
  extraReducers: (builder) => {
    // Handle fetchMeals
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meals = action.payload.data; // Assuming `data` contains the list of meals
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.isLoading = false;
      });

    // Handle addMeal
    builder
      .addCase(addMeal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMeal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meals.push(action.payload.data); // Add the newly created meal to the list
      })
      .addCase(addMeal.rejected, (state, action) => {
        state.isLoading = false;
      });

    // Handle updateMeal
    builder
      .addCase(updateMeal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMeal.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedMeal = action.payload.data; // Assuming updated meal data is returned
        const index = state.meals.findIndex(
          (meal) => meal._id === updatedMeal._id
        );
        if (index !== -1) {
          state.meals[index] = updatedMeal;
        }
      })
      .addCase(updateMeal.rejected, (state, action) => {
        state.isLoading = false;
      });

    // Handle deleteMeal
    builder
      .addCase(deleteMeal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.isLoading = false;
        const { mealId } = action.payload;
        state.meals = state.meals.filter((meal) => meal._id !== mealId);
      })
      .addCase(deleteMeal.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// Export the reducer
export default mealSlice.reducer;
