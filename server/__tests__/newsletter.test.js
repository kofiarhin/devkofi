const Newsletter = require("../Model/newsletterModel");
const sendEmail = require("../utility/sendEmail");
const { api } = require("./utils/request");
const { createUserAndToken, authHeader } = require("./utils/auth");

describe("Newsletter routes", () => {
  it("subscribes a user and sends a confirmation email", async () => {
    const response = await api()
      .post("/api/newsletter")
      .send({ email: "subscriber@test.dev" })
      .expect(200);
    expect(response.body.email).toBe("subscriber@test.dev");
    const saved = await Newsletter.findOne({ email: "subscriber@test.dev" });
    expect(saved).toBeTruthy();
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("prevents duplicate newsletter subscriptions", async () => {
    await api().post("/api/newsletter").send({ email: "subscriber@test.dev" }).expect(200);
    const response = await api()
      .post("/api/newsletter")
      .send({ email: "subscriber@test.dev" })
      .expect(500);
    expect(response.body).toEqual({ success: false, error: "user already exist" });
  });

  it("requires authentication to list newsletter subscribers", async () => {
    const { token } = await createUserAndToken({
      fullName: "Admin User",
      email: "admin-newsletter@test.dev",
      password: "password123",
      pricingId: 1,
      role: "admin",
    });

    await api().post("/api/newsletter").send({ email: "list@test.dev" }).expect(200);

    const response = await api()
      .get("/api/newsletter")
      .set("Authorization", authHeader(token))
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).not.toHaveProperty("password");
  });
});
