import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { startOfWeek, format } from 'date-fns';
import api from '../../services/api';

export const fetchMealPlan = createAsyncThunk(
  'mealPlan/fetchMealPlan',
  async (weekStart, { rejectWithValue }) => {
    try {
      const params = weekStart ? `?weekStart=${weekStart}` : '';
      const response = await api.get(`/meal-plans${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch meal plan');
    }
  }
);

export const addMealPlanItem = createAsyncThunk(
  'mealPlan/addItem',
  async ({ recipeId, date, mealType }, { rejectWithValue }) => {
    try {
      const response = await api.post('/meal-plans/items', { recipeId, date, mealType });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add meal');
    }
  }
);

export const removeMealPlanItem = createAsyncThunk(
  'mealPlan/removeItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/meal-plans/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove meal');
    }
  }
);

export const generateGroceriesFromMealPlan = createAsyncThunk(
  'mealPlan/generateGroceries',
  async (weekStart, { rejectWithValue }) => {
    try {
      const response = await api.post('/meal-plans/generate-groceries', { weekStart });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate groceries');
    }
  }
);

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: {
    currentPlan: null,
    currentWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentWeek: (state, action) => {
      state.currentWeekStart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMealPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload.mealPlan;
      })
      .addCase(fetchMealPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addMealPlanItem.fulfilled, (state, action) => {
        if (state.currentPlan) {
          state.currentPlan.items.push(action.payload.item);
        }
      })
      .addCase(removeMealPlanItem.fulfilled, (state, action) => {
        if (state.currentPlan) {
          state.currentPlan.items = state.currentPlan.items.filter(
            (item) => item.id !== action.payload
          );
        }
      });
  },
});

export const { setCurrentWeek } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
