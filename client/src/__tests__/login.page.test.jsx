import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Login/Login";
import Portal from "../Pages/Portal/Portal";
import {
  renderWithProviders,
  createTestStore,
} from "../tests/utils/renderWithProviders";

const completeLoginForm = async (user, password = "password123") => {
  await user.type(screen.getByLabelText(/email/i), "student@example.com");
  await user.type(screen.getByLabelText(/password/i), password);
};

describe("Login page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("authenticates the user and routes to the portal", async () => {
    const user = userEvent.setup();
    const store = createTestStore();

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<Portal />} />
      </Routes>,
      { route: "/login", store }
    );

    await completeLoginForm(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    const persisted = JSON.parse(window.localStorage.getItem("user"));
    expect(persisted).toMatchObject({ fullName: "Dev Kofi", role: "student" });
    expect(store.getState().auth.user.fullName).toBe("Dev Kofi");

    expect(
      await screen.findByRole("heading", { name: /welcome! dev kofi/i })
    ).toBeInTheDocument();
  });

  it("shows validation feedback when the API rejects credentials", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Login />);

    await completeLoginForm(user, "wrong-password");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/invalid credentials/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
