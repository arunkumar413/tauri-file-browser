import { configureStore } from "@reduxjs/toolkit";
import { tabsSliceReducer } from "./tabsSlice";

export const store = configureStore({
  reducer: {
    tabs: tabsSliceReducer,
  },
});
