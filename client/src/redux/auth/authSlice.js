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
