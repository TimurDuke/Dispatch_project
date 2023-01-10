import learningsSlice from "../slices/learningsSlice";

export const {
  fetchLearningCategoriesRequest,
  fetchLearningCategoriesSuccess,
  fetchLearningCategoriesFailure,
  addLearningCategoryRequest,
  addLearningCategorySuccess,
  addLearningCategoryFailure,
  clearLearningCategoryErrors
} = learningsSlice.actions;