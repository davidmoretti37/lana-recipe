import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchGroceries = createAsyncThunk(
  'groceries/fetchGroceries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/groceries');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch groceries');
    }
  }
);

export const addGroceryItem = createAsyncThunk(
  'groceries/addItem',
  async ({ name, quantity, unit, category }, { rejectWithValue }) => {
    try {
      const response = await api.post('/groceries', { name, quantity, unit, category });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add item');
    }
  }
);

export const toggleGroceryItem = createAsyncThunk(
  'groceries/toggleItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/groceries/${id}/toggle`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to toggle item');
    }
  }
);

export const deleteGroceryItem = createAsyncThunk(
  'groceries/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/groceries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete item');
    }
  }
);

export const clearCheckedItems = createAsyncThunk(
  'groceries/clearChecked',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/groceries/clear/checked');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear items');
    }
  }
);

export const clearAllItems = createAsyncThunk(
  'groceries/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/groceries/clear/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear items');
    }
  }
);

const groceriesSlice = createSlice({
  name: 'groceries',
  initialState: {
    items: [],
    grouped: {},
    stats: { total: 0, checked: 0, unchecked: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroceries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroceries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.grouped = action.payload.grouped;
        state.stats = action.payload.stats;
      })
      .addCase(fetchGroceries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addGroceryItem.fulfilled, (state, action) => {
        state.items.push(action.payload.item);
        state.stats.total += 1;
        state.stats.unchecked += 1;
      })
      .addCase(toggleGroceryItem.fulfilled, (state, action) => {
        const item = action.payload.item;
        const index = state.items.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          const wasChecked = state.items[index].isChecked;
          state.items[index] = item;
          if (wasChecked && !item.isChecked) {
            state.stats.checked -= 1;
            state.stats.unchecked += 1;
          } else if (!wasChecked && item.isChecked) {
            state.stats.checked += 1;
            state.stats.unchecked -= 1;
          }
        }
      })
      .addCase(deleteGroceryItem.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.payload);
        if (item) {
          state.stats.total -= 1;
          if (item.isChecked) {
            state.stats.checked -= 1;
          } else {
            state.stats.unchecked -= 1;
          }
        }
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      .addCase(clearCheckedItems.fulfilled, (state) => {
        state.items = state.items.filter((i) => !i.isChecked);
        state.stats.total = state.items.length;
        state.stats.checked = 0;
        state.stats.unchecked = state.items.length;
      })
      .addCase(clearAllItems.fulfilled, (state) => {
        state.items = [];
        state.grouped = {};
        state.stats = { total: 0, checked: 0, unchecked: 0 };
      });
  },
});

export default groceriesSlice.reducer;
