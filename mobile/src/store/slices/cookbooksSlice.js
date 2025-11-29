import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCookbooks = createAsyncThunk(
  'cookbooks/fetchCookbooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cookbooks');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cookbooks');
    }
  }
);

export const fetchCookbook = createAsyncThunk(
  'cookbooks/fetchCookbook',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cookbooks/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cookbook');
    }
  }
);

export const createCookbook = createAsyncThunk(
  'cookbooks/createCookbook',
  async ({ name, description, color }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cookbooks', { name, description, color });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create cookbook');
    }
  }
);

export const updateCookbook = createAsyncThunk(
  'cookbooks/updateCookbook',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cookbooks/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cookbook');
    }
  }
);

export const deleteCookbook = createAsyncThunk(
  'cookbooks/deleteCookbook',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/cookbooks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete cookbook');
    }
  }
);

const cookbooksSlice = createSlice({
  name: 'cookbooks',
  initialState: {
    items: [],
    currentCookbook: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCookbook: (state) => {
      state.currentCookbook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCookbooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCookbooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cookbooks;
      })
      .addCase(fetchCookbooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCookbook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCookbook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCookbook = action.payload.cookbook;
      })
      .addCase(fetchCookbook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCookbook.fulfilled, (state, action) => {
        state.items.push(action.payload.cookbook);
      })
      .addCase(updateCookbook.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.cookbook.id);
        if (index !== -1) {
          state.items[index] = action.payload.cookbook;
        }
      })
      .addCase(deleteCookbook.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCurrentCookbook } = cookbooksSlice.actions;
export default cookbooksSlice.reducer;
