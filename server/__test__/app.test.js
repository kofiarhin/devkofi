// --- Core Modules ---
const path = require("path");
const fs = require("fs");

// --- External Packages ---
const request = require("supertest");

// --- Internal App Imports ---
const app = require("../app");
const sendEmail = require("../utility/sendEmail");

// --- Helpers & Utilities ---
const {
  createNewsletterUser,
  uploadImage,
  joinMentorship,
  sendAdminNotification,
  generateToken,
  sendWelcomeMessage,
} = require("../utility/helper");

// --- Templates ---
const {
  generateNewSubscriptionEmail,
  generateVerifyUserEmail,
} = require("../utility/templates");

// --- Test Data ---
const { testUser, userOne, userTwo } = require("./data/data");

// --- Test Constants ---
const user = {
  fullName: "david kraku",
  email: "davidkraku69@gmail.com",
  phone: "555323432432342",
};

// --- TEST SUITE ---
describe("app", () => {
  // authorization

  // ----- Email Template & Token Tests -----
  it("should generate email details to admin of new subscription", async () => {
    const { subject, html } = generateNewSubscriptionEmail(user);
    expect(subject).toBeDefined();
    expect(html).toBeDefined();
  });

  it("should test for generate verify user email", async () => {
    const token = generateToken({ email: testUser.email });
    const { subject, html, text, verificationLink } = generateVerifyUserEmail({
      fullName: testUser.fullName,
      token,
    });
    expect(subject).toBeDefined();
    expect(html).toBeDefined();
    expect(verificationLink).toBeDefined();
  });

  it("should test for generating token", async () => {
    const token = generateToken({ email: testUser.email });
    expect(token).toBeTruthy();
  });

  // ----- Admin Routes -----
  it("should test for admin routes", async () => {
    const { body, statusCode } = await request(app).get("/api/admin/users");
    expect(statusCode).toBe(200);
    expect(body).toBeDefined();
  });

  // ----- Commented-Out Tests (Preserved) -----
  // it("should test contact successfully", async () => { ... });
  // it("should send email correctly", async () => { ... });
  // it("should test for joining newsletter", async () => { ... });
  // it("should create new newsletter user successfully", async () => { ... });
  // it("should test endpoint for joining newsletter", async () => { ... });
  // it("should test for download route", async () => { ... });
  // it("should be able to download a specific file successfully", async () => { ... });
  // it("should test for joining mentorship endpoint", async () => { ... });
  // it("should send welcome message properly", async () => { ... });
  // it("should send admin notification of new subscription", async () => { ... });
  // it("should join newsletter successfully", async () => { ... });
  // it("should not register user twice", async () => { ... });
  // it("should join mentorship successfully", async () => { ... });
  // it("should test for contact successfully", async () => { ... });

  it("should test for authrization", async () => {
    const token = generateToken({ email: userOne.email });
    const { statusCode, body } = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(statusCode).toBe(200);
    expect(body.length).toBeGreaterThan(0);
  });

  it("should not allow user with unauthorized access", async () => {
    const { statusCode, body } = await request(app).get("/api/users");
    expect(body.error).toBeDefined();
  });
});
