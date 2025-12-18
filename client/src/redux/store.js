import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import navReducer from "./navigation/navigationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    navigation: navReducer,
  },
});

export default store;
