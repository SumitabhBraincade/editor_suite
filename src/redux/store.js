import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});

export default store;
