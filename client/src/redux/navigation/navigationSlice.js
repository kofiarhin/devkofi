import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleNav: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleNav } = navigationSlice.actions;

export default navigationSlice.reducer;
