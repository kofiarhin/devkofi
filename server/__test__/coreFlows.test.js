const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Team = require("../models/Team");
const TeamEnrollment = require("../models/TeamEnrollment");

const registerAndLogin = async (suffix, role = "student") => {
  const payload = {
    firstName: "Test",
    lastName: suffix,
    email: `user.${suffix}@example.com`,
    password: "password",
  };

  await request(app).post("/api/auth/register").send(payload);

  if (role === "admin") {
    const user = await User.findOne({ email: payload.email });
    user.role = "admin";
    await user.save();
  }

  const login = await request(app).post("/api/auth/login").send({
    email: payload.email,
    password: payload.password,
  });

  return { token: login.body.token, userId: login.body._id };
};

describe("core mentorship flows", () => {
  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Enrollment.deleteMany({}),
      Team.deleteMany({}),
      TeamEnrollment.deleteMany({}),
    ]);
  });

  it("register/login and /me still works", async () => {
    const { token } = await registerAndLogin("auth");
    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(me.statusCode).toBe(200);
    expect(me.body.success).toBe(true);
    expect(me.body.user.email).toContain("user.auth@");
  });

  it("profile onboarding endpoints work for authenticated users", async () => {
    const { token } = await registerAndLogin("profile");

    const intake = await request(app)
      .post("/api/onboarding/intake")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentRole: "Frontend Developer",
        skillLevel: "intermediate",
        mernExperience: "1 year",
        aiExperience: "beginner",
        primaryGoal: "Ship SaaS",
        biggestBlocker: "Architecture",
        currentProjectSummary: "SaaS dashboard",
        timezone: "UTC",
        country: "Ghana",
        preferredStartTimeline: "Immediately",
      });

    expect(intake.statusCode).toBe(200);
    expect(intake.body.profile.onboardingCompleted).toBe(true);

    const status = await request(app)
      .get("/api/onboarding/status")
      .set("Authorization", `Bearer ${token}`);

    expect(status.statusCode).toBe(200);
    expect(status.body.onboardingCompleted).toBe(true);
  });

  it("enrollment application creation works and avoids duplicates", async () => {
    const { token } = await registerAndLogin("enroll");

    await request(app)
      .post("/api/onboarding/intake")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentRole: "Engineer",
        skillLevel: "intermediate",
        mernExperience: "2 years",
        aiExperience: "intermediate",
        primaryGoal: "Ship",
        biggestBlocker: "Testing",
        currentProjectSummary: "API",
        timezone: "UTC",
        country: "Ghana",
        preferredStartTimeline: "2 weeks",
      });

    const first = await request(app)
      .post("/api/enrollments/apply/standard")
      .set("Authorization", `Bearer ${token}`);
    const second = await request(app)
      .post("/api/enrollments/apply/standard")
      .set("Authorization", `Bearer ${token}`);

    expect(first.statusCode).toBe(201);
    expect(second.statusCode).toBe(200);
    expect(String(first.body.enrollment._id)).toBe(String(second.body.enrollment._id));
  });

  it("admin enrollment approval and activation flow works", async () => {
    const student = await registerAndLogin("student");
    const admin = await registerAndLogin("admin", "admin");

    await request(app)
      .post("/api/enrollments/apply/pro")
      .set("Authorization", `Bearer ${student.token}`);

    const approve = await request(app)
      .post("/api/admin/enrollments/approve")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ userId: student.userId });

    const activate = await request(app)
      .post("/api/admin/enrollments/activate")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ userId: student.userId });

    expect(approve.statusCode).toBe(200);
    expect(approve.body.enrollment.applicationStatus).toBe("approved");
    expect(activate.statusCode).toBe(200);
    expect(activate.body.enrollment.status).toBe("active");
  });

  it("team approval flow still works", async () => {
    const owner = await registerAndLogin("owner");
    const admin = await registerAndLogin("teamadmin", "admin");

    const teamRequest = await request(app)
      .post("/api/team/request")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ teamName: "Alpha Team" });

    const team = await Team.findOne({ ownerId: owner.userId }).lean();

    const approve = await request(app)
      .post("/api/admin/team/approve")
      .set("Authorization", `Bearer ${admin.token}`)
      .send({ teamId: team._id });

    expect(teamRequest.statusCode).toBe(200);
    expect(approve.statusCode).toBe(200);
    expect(approve.body.teamEnrollment.status).toBe("active");
  });
});
