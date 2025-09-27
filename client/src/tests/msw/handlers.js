import { http, HttpResponse } from "msw";

const API_ORIGINS = [
  "http://localhost:5000",
  "https://devkofi-883f1d7b0ba0.herokuapp.com",
];

const basePings = API_ORIGINS.map((origin) =>
  http.get(origin, () => HttpResponse.json({ status: "ok" }))
);

const handlers = [
  ...basePings,
  http.get("*/api/info/github", () =>
    HttpResponse.json({
      totalContributions: 120,
      streak: 7,
      repositories: [
        { name: "devkofi", stars: 10 },
        { name: "mentorship-portal", stars: 5 },
      ],
    })
  ),
  http.get("*/api/templates", () =>
    HttpResponse.json({
      templates: [
        { id: "resume", name: "Resume Template" },
        { id: "portfolio", name: "Portfolio Template" },
      ],
    })
  ),
  http.get("*/api/admin/users", () =>
    HttpResponse.json({
      count: 2,
      users: [
        { id: "1", fullName: "Test Student", email: "student@example.com" },
        { id: "2", fullName: "Admin User", email: "admin@example.com" },
      ],
    })
  ),
  http.get("*/api/admin/overview", () =>
    HttpResponse.json({
      usersCount: 12,
      coursesCount: 4,
      messagesCount: 30,
      paymentsCount: 8,
      transactionsCount: 5,
    })
  ),
  http.get("*/api/users", ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return HttpResponse.json({
      users: [
        { id: "1", fullName: "Protected User" },
        { id: "2", fullName: "Second User" },
      ],
    });
  }),
  http.post("*/api/contact", async ({ request }) => {
    const body = await request.json();
    if (!body.email) {
      return HttpResponse.json({ error: "Email is required" }, { status: 400 });
    }
    return HttpResponse.json({ success: true, received: body });
  }),
  http.post("*/api/mentorship", async ({ request }) => {
    const body = await request.json();
    if (body.packageName === "Sold Out") {
      return HttpResponse.json(
        { success: false, error: "Package unavailable" },
        { status: 400 }
      );
    }
    return HttpResponse.json({ success: true, enrollmentId: "enroll-123", ...body });
  }),
  http.post("*/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json();
    if (password !== "password123") {
      return HttpResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      token: "jwt-token",
      user: {
        id: "user-1",
        role: "student",
        fullName: "Dev Kofi",
        email,
      },
    });
  }),
  http.post("*/api/newsletter", async ({ request }) => {
    const body = await request.json();
    if (!body.email?.includes("@")) {
      return HttpResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }
    return HttpResponse.json({ success: true });
  }),
];

export { handlers };
