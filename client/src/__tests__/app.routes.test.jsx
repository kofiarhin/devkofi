import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import {
  renderWithProviders,
  createTestStore,
} from "../tests/utils/renderWithProviders";

describe("App routing", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders home route with header and footer", async () => {
    window.history.pushState({}, "", "/");
    renderWithProviders(<App />, { withRouter: false });

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    const cta = await screen.findByRole("link", { name: /get started!/i });
    expect(cta).toBeVisible();
  });

  it("navigates to login when the nav link is clicked", async () => {
    window.history.pushState({}, "", "/");
    renderWithProviders(<App />, { withRouter: false });

    const user = userEvent.setup();
    const loginLink = await screen.findByRole("link", { name: /login/i });
    await user.click(loginLink);

    expect(
      await screen.findByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("redirects unauthenticated users away from protected routes", async () => {
    window.history.pushState({}, "", "/portal");
    renderWithProviders(<App />, { withRouter: false });

    expect(
      await screen.findByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("allows authenticated students to view the portal dashboard", async () => {
    window.history.pushState({}, "", "/portal");
    const store = createTestStore({
      auth: {
        user: {
          id: "user-1",
          role: "student",
          fullName: "Portal Tester",
          email: "portal@test.dev",
        },
        isLoading: false,
        isError: false,
        isSuccess: true,
      },
      navigation: { isOpen: false },
    });

    renderWithProviders(<App />, { withRouter: false, store });

    expect(
      await screen.findByRole("heading", { name: /welcome! portal tester/i })
    ).toBeInTheDocument();
  });
});
