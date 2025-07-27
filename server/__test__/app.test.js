const sendEmail = require("../utility/sendEmail");
const request = require("supertest");
const app = require("../app");
const { sendWelcomeMessage } = require("../utility/helper");
const {
  createNewsletterUser,
  uploadImage,
  joinMentorship,
  sendAdminNotification,
} = require("../utility/helper");
const path = require("path");
const fs = require("fs");
const { generateNewSubscriptionEmail } = require("../utility/templates");

const user = {
  fullName: "david kraku",
  email: "davidkraku69@gmail.com",
  phone: "555323432432342",
};

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

  it("should test for download route", async () => {
    const { body, statusCode } = await request(app).get("/api/download");
    expect(statusCode).toBe(200);
  });

  it("should be able to download a specific file successfully", async () => {
    const filename = "mern-stack-starter.zip";
    const { statusCode, body } = await request(app).get(
      `/api/download?filename=${filename}`
    );
  });

  it("shoudl join mentorship successfullly", async () => {
    const result = await joinMentorship({
      fullName: "david kraku",
      email: "davidKraku69@gmail.com",
      phone: "44234232432343",
    });
    expect(result).toBeTruthy();
  });

  // it("should test join mentorship endpoint", async () => {
  //   const { body, statusCode } = await request(app)
  //     .post("/api/mentorship")
  //     .send({
  //       fullName: "david kraku",
  //       email: "davidkraku@gmail.com",
  //       phone: "323424",
  //     });
  //   expect(statusCode).toBe(201);
  //   expect(body._id).toBeDefined();
  // });

  // it("should send welcomemessage properly", async () => {
  //   const result = await sendWelcomeMessage({
  //     name: "david kraku",
  //     email: "davidkraku69@gmail.com",
  //   });
  // });

  it("should generate email details to  admin of new subscription", async () => {
    const { subject, html } = generateNewSubscriptionEmail(user);
    expect(subject).toBeDefined();
    expect(html).toBeDefined();
  });

  // it("should send admin notification of new subscription", async () => {
  //   const { success } = await sendAdminNotification(user);
  //   expect(success).toBeTruthy();
  // });

  it("should test for adnmin routes", async () => {
    const { body, statusCode } = await request(app).get("/api/admin/users");
    expect(statusCode).toBe(200);
    expect(body).toBeDefined();
  });

  it("should join news letter successfully", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/newsletter")
      .send({ email: "test@gamil.com" });
    expect(statusCode).toBe(200);
    expect(body._id).toBeTruthy();
  });

  it("should not register user twice", async () => {
    const userEmail = "test2@gmail.com";
    await request(app).post("/api/newsletter").send({ email: userEmail });
    const { statusCode, body } = await request(app)
      .post("/api/newsletter")
      .send({ email: userEmail });
    expect(statusCode).not.toBe(200);
    expect(body.error).toBe("user already exist");
  });
});
