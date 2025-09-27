import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../../redux/auth/authSlice";
import navigationReducer from "../../redux/navigation/navigationSlice";
import { createTestQueryClient } from "./queryClient";

const createTestStore = (preloadedState) =>
  configureStore({
    reducer: {
      auth: authReducer,
      navigation: navigationReducer,
    },
    preloadedState,
  });

const renderWithProviders = (
  ui,
  {
    route = "/",
    historyEntries = [route],
    store = createTestStore(),
    queryClient = createTestQueryClient(),
    withRouter = true,
  } = {}
) => {
  const Wrapper = ({ children }) => {
    const content = withRouter ? (
      <MemoryRouter initialEntries={historyEntries}>{children}</MemoryRouter>
    ) : (
      children
    );

    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
      </Provider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
    store,
    queryClient,
  };
};

export { renderWithProviders, createTestStore };
