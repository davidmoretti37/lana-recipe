import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ search, cookbookId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (cookbookId) params.append('cookbookId', cookbookId);

      const response = await api.get(`/recipes?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recipes');
    }
  }
);

export const fetchRecipe = createAsyncThunk(
  'recipes/fetchRecipe',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recipe');
    }
  }
);

export const extractRecipe = createAsyncThunk(
  'recipes/extractRecipe',
  async ({ imageUrls, videoUrl, caption, sourceUrl, cookbookId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/recipes/extract', {
        imageUrls,
        videoUrl,
        caption,
        sourceUrl,
        cookbookId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to extract recipe');
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/recipes/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update recipe');
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/recipes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete recipe');
    }
  }
);

export const addRecipeToGroceries = createAsyncThunk(
  'recipes/addToGroceries',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/recipes/${id}/add-to-groceries`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to groceries');
    }
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    currentRecipe: null,
    isLoading: false,
    isExtracting: false,
    error: null,
    pagination: null,
  },
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.recipes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single recipe
      .addCase(fetchRecipe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecipe = action.payload.recipe;
      })
      .addCase(fetchRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Extract recipe
      .addCase(extractRecipe.pending, (state) => {
        state.isExtracting = true;
        state.error = null;
      })
      .addCase(extractRecipe.fulfilled, (state, action) => {
        state.isExtracting = false;
        state.items.unshift(action.payload.recipe);
        state.currentRecipe = action.payload.recipe;
      })
      .addCase(extractRecipe.rejected, (state, action) => {
        state.isExtracting = false;
        state.error = action.payload;
      })
      // Update recipe
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.recipe.id);
        if (index !== -1) {
          state.items[index] = action.payload.recipe;
        }
        state.currentRecipe = action.payload.recipe;
      })
      // Delete recipe
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
        if (state.currentRecipe?.id === action.payload) {
          state.currentRecipe = null;
        }
      });
  },
});

export const { clearCurrentRecipe, clearError } = recipesSlice.actions;
export default recipesSlice.reducer;
