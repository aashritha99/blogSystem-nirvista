import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';
import uiSlice from './slices/uiSlice';
import categorySlice from './slices/categorySlice';
import commentSlice from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    blog: blogSlice,
    ui: uiSlice,
    category: categorySlice,
    comment: commentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;