import {createSlice} from "@reduxjs/toolkit";

const name = 'learnings';

const learningsSlice = createSlice({
  name,
  initialState: {
    categories: [],
    loading: false,
    error: null,
    addCategoryLoading: false,
    addCategoryError: null,
  },
  reducers: {
    fetchLearningCategoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLearningCategoriesSuccess(state, action) {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchLearningCategoriesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addLearningCategoryRequest(state) {
      state.addCategoryLoading = true;
      state.addCategoryError = null;
    },
    addLearningCategorySuccess(state) {
      state.addCategoryLoading = false;
    },
    addLearningCategoryFailure(state, action) {
      state.addCategoryLoading = false;
      state.addCategoryError = action.payload;
    },

    clearLearningCategoryErrors(state) {
      state.addCategoryError = null;
      state.error = null;
    },
  }
});

export default learningsSlice;