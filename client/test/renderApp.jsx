import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../src/App";
import authReducer from "../src/redux/auth/authSlice";
import navigationReducer from "../src/redux/navigation/navigationSlice";

export const renderApp = (route, { admin = null, isOpen = false } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer, navigation: navigationReducer },
    preloadedState: { auth: { admin, isChecked: true }, navigation: { isOpen } },
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}><AppRoutes /></MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
};
