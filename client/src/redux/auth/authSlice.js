import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      (state.isLoading = false), (state.isError = false), (state.message = "");
    },
    setUser: (state, action) => {
      state.isLoading = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { reset, setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
