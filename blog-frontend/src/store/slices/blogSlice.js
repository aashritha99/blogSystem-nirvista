import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const initialState = {
  blogs: [],
  blog: null,
  totalPages: 0,
  currentPage: 1,
  totalBlogs: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  searchQuery: '',
  selectedCategory: null,
  selectedTag: null,
};

// Get all blogs
export const getBlogs = createAsyncThunk(
  'blog/getBlogs',
  async ({ page = 1, search = '', category = '', tag = '' }, thunkAPI) => {
    try {
      let url = `${API_URL}/blogs/?page=${page}`;
      if (search) url += `&search=${search}`;
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single blog
export const getBlog = createAsyncThunk(
  'blog/getBlog',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}/`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.post(`${API_URL}/blogs/`, blogData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async ({ id, blogData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.put(`${API_URL}/blogs/${id}/`, blogData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/blogs/${id}/`, config);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get blogs by category
export const getBlogsByCategory = createAsyncThunk(
  'blog/getBlogsByCategory',
  async ({ categoryId, page = 1 }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/?category=${categoryId}&page=${page}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get blogs by tag
export const getBlogsByTag = createAsyncThunk(
  'blog/getBlogsByTag',
  async ({ tagId, page = 1 }, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/?tag=${tagId}&page=${page}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearBlog: (state) => {
      state.blog = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 10);
        state.totalBlogs = action.payload.count;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blog = action.payload;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.blog = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBlogsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 10);
        state.totalBlogs = action.payload.count;
      })
      .addCase(getBlogsByTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 10);
        state.totalBlogs = action.payload.count;
      });
  },
});

export const {
  reset,
  clearBlog,
  setSearchQuery,
  setSelectedCategory,
  setSelectedTag,
  setCurrentPage,
} = blogSlice.actions;

// Export aliases for compatibility
export const fetchBlogs = getBlogs;
export const fetchBlogById = getBlog;
export const fetchBlogsByCategory = getBlogsByCategory;
export const fetchBlogsByTag = getBlogsByTag;

export default blogSlice.reducer;