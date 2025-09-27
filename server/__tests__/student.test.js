const Contact = require("../Model/contactModel");
const { api } = require("./utils/request");

describe("Student routes", () => {
  it("returns dashboard metrics", async () => {
    await Contact.create({
      fullName: "Contact One",
      email: "contact1@test.dev",
      message: "Hello",
    });

    const response = await api().get("/api/student/overview").expect(200);
    expect(response.body).toMatchObject({
      assignmentsCount: 0,
      messagesCount: 1,
      profileCompletion: 0,
    });
  });
});
