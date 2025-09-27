const Contact = require("../Model/contactModel");
const sendEmail = require("../utility/sendEmail");
const { api } = require("./utils/request");

describe("Contact routes", () => {
  it("returns a placeholder message for GET requests", async () => {
    const response = await api().get("/api/contact").expect(200);
    expect(response.body).toEqual({ message: "get contact" });
  });

  it("creates a contact message and notifies both user and admin", async () => {
    const payload = {
      fullName: "Contact User",
      email: "contact@test.dev",
      message: "Hello there!",
    };

    const response = await api().post("/api/contact").send(payload).expect(200);
    expect(response.body).toEqual({ success: true });
    const savedContacts = await Contact.find({ email: payload.email });
    expect(savedContacts.length).toBe(1);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("returns an error when a required field is missing", async () => {
    const response = await api()
      .post("/api/contact")
      .send({ email: "contact@test.dev" })
      .expect(500);
    expect(response.body).toEqual({
      success: false,
      error: "please fill out all fields",
    });
  });
});
