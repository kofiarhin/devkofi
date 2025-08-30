import { createSlice } from "@reduxjs/toolkit";

// Safely read and parse persisted user from localStorage
let persistedUser = null;
try {
  const raw = typeof window !== "undefined" && window.localStorage
    ? window.localStorage.getItem("user")
    : null;
  if (raw && raw !== "undefined" && raw !== "null") {
    persistedUser = JSON.parse(raw);
  }
} catch (_) {
  // If parsing fails or storage is inaccessible, fall back to null
  persistedUser = null;
}

const initialState = {
  user: persistedUser,
  isLoading: false,
  isError: false,
  isSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.isLoading = false;
      state.isSucess = true;
      state.user = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
