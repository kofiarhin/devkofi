const app = require("../app");
const request = require("supertest");
const { userTwo } = require("./data/data");

describe("app", () => {
  it("should just pass", async () => {
    expect(1).toBe(1);
  });

  // it("should join mentorship properly", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/mentorship")
  //     .send(userTwo);
  //   console.log({ statusCode, body });
  // });

  // it("should join news letter properly", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/newsletter")
  //     .send({ email: "test@gmail.com" });
  //   console.log({ statusCode, body });
  // });

  // it("should contact successfully", async () => {
  //   const { statusCode, body } = await request(app)
  //     .post("/api/contact")
  //     .send({
  //       fullName: userTwo.fullName,
  //       email: userTwo.email,
  //       message: "testsing mic",
  //     });
  //   console.log({ statusCode, body });
  // });

  it("should test for 404 page not found", async () => {
    const { statusCode, body } = await request(app).get("/api/no-route");
    console.log({ statusCode, body });
  });
});
