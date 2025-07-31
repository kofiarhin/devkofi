const sendEmail = require("../utility/sendEmail");
const request = require("supertest");
const app = require("../app");
const { sendWelcomeMessage } = require("../utility/helper");
const { testUser, userOne, userTwo } = require("./data/data");
const {
  createNewsletterUser,
  uploadImage,
  joinMentorship,
  sendAdminNotification,
  generateToken,
} = require("../utility/helper");
const path = require("path");
const fs = require("fs");
const {
  generateNewSubscriptionEmail,
  generateVerifyUserEmail,
} = require("../utility/templates");

const user = {
  fullName: "david kraku",
  email: "davidkraku69@gmail.com",
  phone: "555323432432342",
};

describe("app", () => {
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

  // it("should create new newsletter using successfully", async () => {
  //   const email = "davidkraky69@gmail.com";
  //   const result = await createNewsletterUser({
  //     email,
  //   });

  //   expect(result._id).toBeDefined();
  //   expect(result).toHaveProperty("email");
  //   expect(result.email).toBe(email);
  // });

  // it("should test endpoint for joining news letter", async () => {
  //   const email = "davidkraky69@gmail.com";
  //   const { statusCode, body } = await request(app)
  //     .post("/api/newsletter")
  //     .send({ email });
  // });

  // it("should test for download route", async () => {
  //   const { body, statusCode } = await request(app).get("/api/download");
  //   expect(statusCode).toBe(200);
  // });

  // it("should be able to download a specific file successfully", async () => {
  //   const filename = "mern-stack-starter.zip";
  //   const { statusCode, body } = await request(app).get(
  //     `/api/download?filename=${filename}`
  //   );
  // });

  // it("should test forjoining mentorship endpoint", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/mentorship")
  //     .send(testUser);
  //   expect(statusCode).toBe(201);
  //   expect(body.user._id).toBeDefined();
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

  // it("should join news letter successfully", async () => {
  //   const { body, statusCode } = await request(app)
  //     .post("/api/newsletter")
  //     .send({ email: "test@gamil.com" });
  //   expect(statusCode).toBe(200);
  //   expect(body._id).toBeTruthy();
  // });

  // it("should not register user twice", async () => {
  //   const userEmail = "test2@gmail.com";
  //   await request(app).post("/api/newsletter").send({ email: userEmail });
  //   const { statusCode, body } = await request(app)
  //     .post("/api/newsletter")
  //     .send({ email: userEmail });
  //   expect(statusCode).not.toBe(200);
  //   expect(body.error).toBe("user already exist");
  // });
  it("should test for genereate verify user email", async () => {
    const token = generateToken({ email: testUser.email });
    const { subject, html, text, verificationLink } = generateVerifyUserEmail({
      fullName: testUser.fullName,
      token,
    });
    console.log({ verificationLink });
    expect(subject).toBeDefined();
    expect(html).toBeDefined();
    expect(verificationLink).toBeDefined();
  });

  it("should test for generating token", async () => {
    const token = generateToken({ email: testUser.email });
    expect(token).toBeTruthy();
  });

  it("should join mentorship successfully", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/mentorship")
      .send(userTwo);
    console.log({ statusCode, body });
  });
});
