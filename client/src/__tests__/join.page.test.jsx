import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { http, HttpResponse } from "msw";
import JoinMentorship from "../Pages/JoinMentorship/JoinMentorship";
import Success from "../Pages/Success/Success";
import { renderWithProviders } from "../tests/utils/renderWithProviders";
import { server } from "../tests/msw/server";

const fillMentorshipForm = async (user) => {
  await user.type(
    screen.getByPlaceholderText(/e\.g\. jane doe/i),
    "Test Learner"
  );
  await user.type(
    screen.getByPlaceholderText(/you@example.com/i),
    "learner@example.com"
  );
  await user.type(
    screen.getByPlaceholderText(/\+44 1234 567890/i),
    "+233200000000"
  );
  await user.selectOptions(
    screen.getByRole("combobox", { name: /select package/i }),
    "Full-Stack Bootcamp: Standard"
  );
};

describe("Join mentorship page", () => {
  it("sends the enrollment payload and redirects on success", async () => {
    const requests = [];
    server.use(
      http.post("*/api/mentorship", async ({ request }) => {
        const body = await request.json();
        requests.push(body);
        return HttpResponse.json({ success: true });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/mentorship" element={<JoinMentorship />} />
        <Route path="/success" element={<Success />} />
      </Routes>,
      { route: "/mentorship" }
    );

    await fillMentorshipForm(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(requests[0]).toMatchObject({
      fullName: "Test Learner",
      email: "learner@example.com",
      phone: "+233200000000",
      packageName: "Full-Stack Bootcamp: Standard",
    });

    expect(
      await screen.findByRole("heading", { name: /mentorship request sent/i })
    ).toBeInTheDocument();
  });

  it("surfaces API errors returned by the mutation", async () => {
    server.use(
      http.post("*/api/mentorship", () =>
        HttpResponse.json(
          { success: false, error: "Package unavailable" },
          { status: 400 }
        )
      )
    );

    const user = userEvent.setup();
    renderWithProviders(<JoinMentorship />);

    await fillMentorshipForm(user);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/package unavailable/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /join mentorship/i })
    ).toBeInTheDocument();
  });
});
