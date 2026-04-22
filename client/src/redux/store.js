import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./navigation/navigationSlice";

const store = configureStore({
  reducer: {
    navigation: navReducer,
  },
});

export default store;
