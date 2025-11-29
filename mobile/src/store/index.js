import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import recipesReducer from './slices/recipesSlice';
import cookbooksReducer from './slices/cookbooksSlice';
import mealPlanReducer from './slices/mealPlanSlice';
import groceriesReducer from './slices/groceriesSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipesReducer,
  cookbooks: cookbooksReducer,
  mealPlan: mealPlanReducer,
  groceries: groceriesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
