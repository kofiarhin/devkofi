import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";
import Contact from "../Pages/contact/contact";
import Success from "../Pages/Success/Success";
import ErrorPage from "../Pages/Error/Error";
import { renderWithProviders } from "../tests/utils/renderWithProviders";
import { server } from "../tests/msw/server";

describe("Contact page", () => {
  const populateForm = async (user) => {
    await user.type(
      screen.getByPlaceholderText(/your full name/i),
      "Jane Doe"
    );
    await user.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "jane@example.com"
    );
    await user.type(
      screen.getByPlaceholderText(/your message/i),
      "I would love to learn more."
    );
  };

  it("submits a message and redirects to the success screen", async () => {
    const requests = [];
    server.use(
      http.post("*/api/contact", async ({ request }) => {
        const body = await request.json();
        requests.push(body);
        return HttpResponse.json({ success: true });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
      </Routes>,
      { route: "/contact" }
    );

    await populateForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(requests[0]).toMatchObject({
      fullName: "Jane Doe",
      email: "jane@example.com",
      message: "I would love to learn more.",
    });

    expect(
      await screen.findByRole("heading", { name: /thank you for contacting me/i })
    ).toBeInTheDocument();
  });

  it("routes to the error screen when the API fails", async () => {
    server.use(
      http.post("*/api/contact", () =>
        HttpResponse.json({ error: "Server offline" }, { status: 500 })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/contact" element={<Contact />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>,
      { route: "/contact" }
    );

    await populateForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();
  });
});
