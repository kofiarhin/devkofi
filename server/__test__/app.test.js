const sendEmail = require("../utility/sendEmail");
const request = require("supertest");
const app = require("../app");
const { createNewsletterUser } = require("../utility/helper");

describe("app", () => {
  it("just a passing test", () => {
    expect(1).toBe(1);
  });

  // it("should test contact successfully", async () => {
  //   const message = {
  //     name: "david kraku",
  //     email: "davidkraku69@gmail.com",
  //     message: "some enquiry about product",
  //   };
  //   const { body, statusCode } = await request(app)
  //     .post("/api/contact")
  //     .send(message);
  // });

  // it("should send email correctly", async () => {
  //   const emailOptions = {
  //     to: "davidkraku69@gmail.com",
  //     subject: "test",
  //     text: "testing mic one two",
  //   };

  //   const { accepted } = await sendEmail(emailOptions);
  //   expect(accepted.length).toBeGreaterThan(0);
  // });

  it("should test for joining news letter", async () => {
    const { body, statusCode } = await request(app).get("/api/newsletter");
    expect(statusCode).toBe(200);
  });

  it("should create new newsletter using successfully", async () => {
    const email = "davidkraky69@gmail.com";
    const result = await createNewsletterUser({
      email,
    });

    expect(result._id).toBeDefined();
    expect(result).toHaveProperty("email");
    expect(result.email).toBe(email);
  });

  it("should test endpoint for joining news letter", async () => {
    const email = "davidkraky69@gmail.com";
    const { statusCode, body } = await request(app)
      .post("/api/newsletter")
      .send({ email });
  });
});
