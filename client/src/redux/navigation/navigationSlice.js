import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleSideNav: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSideNav: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleSideNav, closeSideNav } = navigationSlice.actions;
export default navigationSlice.reducer;
