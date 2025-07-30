import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./navigation/navigationSlice";
import authReducer from "./auth/authSlice";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    auth: authReducer,
  },
});

export default store;
