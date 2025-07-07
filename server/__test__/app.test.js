const sendEmail = require("../utility/sendEmail");
const request = require("supertest");
const app = require("../app");

describe("app", () => {
  it("just a passing test", () => {
    expect(1).toBe(1);
  });

  it("should test contact successfully", async () => {
    const message = {
      name: "david kraku",
      email: "davidkraku69@gmail.com",
      message: "some enquiry about product",
    };
    const { body, statusCode } = await request(app)
      .post("/api/contact")
      .send(message);
  });

  // it("should send email correctly", async () => {
  //   const emailOptions = {
  //     to: "davidkraku69@gmail.com",
  //     subject: "test",
  //     text: "testing mic one two",
  //   };

  //   const { accepted } = await sendEmail(emailOptions);
  //   expect(accepted.length).toBeGreaterThan(0);
  // });
});
