import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabGroups: [{ path: "/home", active: true, history: [] }],
};

export const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    addTab: (state, action) => {
      // Deactivate all, add new one active
      state.tabGroups.forEach(tab => { tab.active = false; });
      state.tabGroups.push({ path: action.payload, active: true, history: [] });
    },
    setActiveTab: (state, action) => {
      state.tabGroups.forEach((tab, i) => {
        tab.active = i === action.payload;
      });
    },
    closeTab: (state, action) => {
      const index = action.payload;
      if (state.tabGroups.length === 1) {
        // Optional: If closing the last tab, reset to home, or don't allow closing
        return; // Alternatively, rest to default. Let's block closing the last tab for simplicity.
      }
      const closingActiveTab = state.tabGroups[index].active;
      state.tabGroups.splice(index, 1);
      
      if (closingActiveTab) {
        const nextIndex = index > 0 ? index - 1 : 0;
        state.tabGroups[nextIndex].active = true;
      }
    },
    updateTabPath: (state, action) => {
      const { index, path, addToHistory = true } = action.payload;
      const tab = state.tabGroups[index];
      if (addToHistory && tab.path) {
        tab.history.push(tab.path);
      }
      tab.path = path;
    },
    goBack: (state, action) => {
      const index = action.payload;
      const tab = state.tabGroups[index];
      if (tab.history.length === 0) return;
      const previousPath = tab.history.pop();
      tab.path = previousPath;
    },
  },
});

export const { addTab, setActiveTab, closeTab, updateTabPath, goBack } = tabsSlice.actions;

export const tabsSliceReducer = tabsSlice.reducer;
