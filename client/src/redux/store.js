import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./navigation/navigationSlice";
import authReducer from "./auth/authSlice";

const store = configureStore({
  reducer: {
    navigation: navReducer,
    auth: authReducer,
  },
});

export default store;
