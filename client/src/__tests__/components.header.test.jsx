import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header/Header";
import {
  renderWithProviders,
  createTestStore,
} from "../tests/utils/renderWithProviders";
import { vi, afterEach } from "vitest";
import { Routes, Route } from "react-router-dom";

describe("Header component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows guest navigation with a call to action", () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.getAllByRole("button", { name: /join now/i })[0]).toBeEnabled();
  });

  it("reveals the side navigation drawer when the menu icon is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Header />);

    expect(document.getElementById("sideNav")).not.toBeInTheDocument();

    const menuIcon = container.querySelector(".menu");
    await user.click(menuIcon);

    expect(document.getElementById("sideNav")).toBeInTheDocument();
  });

  it("renders authenticated navigation controls", async () => {
    const store = createTestStore({
      auth: {
        user: {
          id: "user-1",
          role: "student",
          fullName: "Header Tester",
          email: "header@test.dev",
        },
        isLoading: false,
        isError: false,
        isSuccess: true,
      },
      navigation: { isOpen: false },
    });

    const user = userEvent.setup();
    renderWithProviders(<Header />, { store });

    expect(screen.getByRole("link", { name: /portal/i })).toHaveAttribute(
      "href",
      "/portal"
    );

    const logoutButtons = screen.getAllByRole("button", { name: /logout/i });
    expect(logoutButtons.length).toBeGreaterThan(0);

    await user.click(logoutButtons[0]);
    expect(store.getState().auth.user).toBeNull();
  });

  it("hides the playground link outside development", () => {
    vi.stubEnv("MODE", "production");

    renderWithProviders(<Header />);

    expect(screen.queryByRole("link", { name: /playground/i })).not.toBeInTheDocument();
  });

  it("navigates to the register page from the hero call to action", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/register" element={<p>Registration</p>} />
      </Routes>
    );

    await user.click(screen.getAllByRole("button", { name: /join now/i })[0]);
    expect(await screen.findByText(/registration/i)).toBeInTheDocument();
  });

  it("navigates to the register page from the nav menu button", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/register" element={<p>Register CTA</p>} />
      </Routes>
    );

    await user.click(screen.getAllByRole("button", { name: /join now/i })[1]);
    expect(await screen.findByText(/register cta/i)).toBeInTheDocument();
  });
});
