const {
  generateNewsLetterSubscriptionEmail,
  generateVerifyUserEmail,
  generateNewSubscriptionEmail,
} = require("../utility/templates");

const originalEnv = process.env.NODE_ENV;

describe("email templates", () => {
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("creates a newsletter confirmation email", () => {
    const result = generateNewsLetterSubscriptionEmail("person@test.dev");
    expect(result.subject).toContain("Thank You for Joining");
    expect(result.html).toContain("person@test.dev");
  });

  it("falls back to the production base url when verifying users", () => {
    process.env.NODE_ENV = "production";
    const { verificationLink } = generateVerifyUserEmail({
      fullName: "Tester",
      token: "abc123",
    });
    expect(verificationLink).toContain("/api/auth/verify?token=abc123");
    expect(verificationLink.startsWith("http")).toBe(true);
  });

  it("generates admin notifications for new subscriptions", () => {
    const result = generateNewSubscriptionEmail("admin@test.dev");
    expect(result.subject).toBe("New Subscription: admin@test.dev");
    expect(result.html).toContain("admin@test.dev");
  });
});
