import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header/Header";
import {
  renderWithProviders,
  createTestStore,
} from "../tests/utils/renderWithProviders";

describe("Header component", () => {
  beforeEach(() => {
    window.localStorage.clear();
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
});
