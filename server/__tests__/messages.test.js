const { api } = require("./utils/request");

describe("Messages routes", () => {
  it("returns a placeholder list response", async () => {
    const response = await api().get("/api/messages").expect(200);
    expect(response.body).toEqual({ message: "get messages" });
  });

  it("accepts a message payload", async () => {
    const payload = { subject: "Hello" };
    const response = await api().post("/api/messages").send(payload).expect(200);
    expect(response.body).toEqual({ message: "create message" });
  });
});
