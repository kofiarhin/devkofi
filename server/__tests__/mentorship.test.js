const Mentorship = require("../Model/mentorshipModel");
const sendEmail = require("../utility/sendEmail");
const { api } = require("./utils/request");

describe("Mentorship routes", () => {
  it("creates a mentorship enrollment and sends notifications", async () => {
    const payload = {
      fullName: "Mentor Joiner",
      email: "mentor@test.dev",
      phone: "+123456789",
      packageName: "Full-Stack Bootcamp",
    };

    const response = await api().post("/api/mentorship").send(payload).expect(201);
    expect(response.body.success).toBe(true);
    const saved = await Mentorship.findOne({ email: payload.email });
    expect(saved).toBeTruthy();
    expect(saved.verified).toBe(false);
    expect(sendEmail).toHaveBeenCalledTimes(3);
  });

  it("prevents duplicate mentorship enrollments", async () => {
    const payload = {
      fullName: "Mentor Joiner",
      email: "mentor@test.dev",
      phone: "+123456789",
      packageName: "Full-Stack Bootcamp",
    };

    await api().post("/api/mentorship").send(payload).expect(201);
    const response = await api().post("/api/mentorship").send(payload).expect(500);
    expect(response.body).toEqual({ success: false, error: "user already exist" });
  });

  it("validates required fields when joining the mentorship", async () => {
    const response = await api()
      .post("/api/mentorship")
      .send({ email: "missing@test.dev" })
      .expect(500);
    expect(response.body).toEqual({
      success: false,
      error: "please fill out all fields",
    });
  });
});
