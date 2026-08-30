import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "../src/App";
import authReducer from "../src/redux/auth/authSlice";
import navigationReducer from "../src/redux/navigation/navigationSlice";
import useProjects from "../src/hooks/useProjects";

vi.mock("../src/hooks/useProjects", () => ({ default: vi.fn() }));
vi.mock("../src/hooks/queries/useAdminSession", () => ({ default: () => ({}) }));
afterEach(cleanup);

const Location = () => <output aria-label="Current route">{useLocation().pathname}</output>;
const renderRoute = (route, state = {}) => {
  const refetch = vi.fn();
  vi.mocked(useProjects).mockReturnValue({ data: [], isLoading: false, isError: false, refetch, ...state });
  const store = configureStore({ reducer: { auth: authReducer, navigation: navigationReducer } });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}><AppRoutes /><Location /></MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
  return refetch;
};

describe("Showcase routes", () => {
  it.each([
    ["/products", "/work", ["Hibachi", "Brain", "LeadRadar", "Forge", "ThriftChef"]],
    ["/projects", "/work", ["Hibachi", "Brain", "LeadRadar", "Forge", "ThriftChef"]],
    ["/templates", "/engineering-systems", ["AI Dev Workspace", "Codex Workflow Kit", "Agent System", "Context API", "Ideas Hub"]],
  ])("keeps %s redirecting to %s with the approved catalog", async (from, to, names) => {
    renderRoute(from);
    expect(screen.getByLabelText("Current route")).toHaveTextContent(to);
    const cards = await screen.findAllByRole("article");
    expect(cards.map((card) => within(card).getByRole("heading", { level: 3 }).textContent)).toEqual(names);
  });

  it.each(["/work", "/engineering-systems"])("preserves loading and retry behavior on %s", (route) => {
    renderRoute(route, { isLoading: true });
    expect(screen.getByText(/Loading engineering/)).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    cleanup();
    const retry = renderRoute(route, { isError: true });
    expect(screen.getByText(/could not be loaded/)).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
