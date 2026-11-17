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
vi.mock("../src/hooks/queries/useBookingAvailability", () => ({
  default: () => ({ data: { days: [] }, isLoading: false, isError: false, error: null }),
}));
vi.mock("../src/hooks/mutations/useCreateBooking", () => ({
  default: () => ({ mutate: vi.fn(), reset: vi.fn(), isPending: false, isError: false, error: null }),
}));
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

const sectionByHeading = (name) => screen.getByRole("heading", { level: 2, name }).closest("section");
const cardNames = (section) =>
  within(section).getAllByRole("article").map((card) => within(card).getByRole("heading", { level: 3 }).textContent);

describe("Showcase routes", () => {
  it.each([
    ["/services", "/ai-integration"],
    ["/ai-workflow-audit", "/ai-integration"],
    ["/engineering-systems", "/work"],
    ["/systems", "/work"],
    ["/templates", "/work"],
    ["/products", "/work"],
    ["/projects", "/work"],
  ])("redirects retired route %s to %s instead of a 404", (from, to) => {
    renderRoute(from);
    expect(screen.getByLabelText("Current route")).toHaveTextContent(to);
    expect(screen.queryByRole("heading", { name: "Page not found" })).not.toBeInTheDocument();
  });

  it.each(["/", "/ai-integration", "/mentorship", "/work", "/about", "/book-a-call", "/contact"])(
    "renders %s without a 404",
    (route) => {
      renderRoute(route);
      expect(screen.getByLabelText("Current route")).toHaveTextContent(route);
      expect(screen.queryByRole("heading", { name: "Page not found" })).not.toBeInTheDocument();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    },
  );

  it("leads Work with the three case studies, then folds in Systems and other projects", () => {
    renderRoute("/work");
    expect(cardNames(sectionByHeading("Three builds, start to finish."))).toEqual(["Hibachi", "Brain", "EscoWear"]);
    expect(cardNames(sectionByHeading("The systems behind how I build."))).toEqual([
      "AI Dev Workspace",
      "Codex Workflow Kit",
      "Agent System",
      "Context API",
      "Ideas Hub",
    ]);
    expect(cardNames(sectionByHeading("Other things I have built."))).toEqual(["LeadRadar", "Forge", "ThriftChef"]);

    const hibachi = within(sectionByHeading("Three builds, start to finish.")).getAllByRole("article")[0];
    ["Problem", "What I built", "Result"].forEach((label) => expect(within(hibachi).getByText(label)).toBeInTheDocument());
  });

  it("preserves loading and retry behaviour for the project-backed sections on /work", () => {
    renderRoute("/work", { isLoading: true });
    expect(screen.getByText("Loading engineering systems...")).toBeInTheDocument();
    expect(screen.getByText("Loading work...")).toBeInTheDocument();
    cleanup();

    const retry = renderRoute("/work", { isError: true });
    expect(screen.getByText("Engineering systems could not be loaded.")).toBeInTheDocument();
    expect(screen.getByText("Work is temporarily unavailable.")).toBeInTheDocument();
    // Case studies are static content and stay visible even when the projects API fails.
    expect(cardNames(sectionByHeading("Three builds, start to finish."))).toHaveLength(3);
    fireEvent.click(screen.getAllByRole("button", { name: "Try again" })[0]);
    expect(retry).toHaveBeenCalledOnce();
  });
});
