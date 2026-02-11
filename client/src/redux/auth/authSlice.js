import { createSlice } from "@reduxjs/toolkit";

const stored = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: stored || null,
  token: stored?.token || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload?.token || null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      localStorage.removeItem("user");
    },
  },
});

export const { reset, setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
