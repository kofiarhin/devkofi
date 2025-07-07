import { describe, expect, it } from "vitest";
import { getUsers, getTemplates, sendMessage } from "../src/services/services";
describe("app", () => {
  it("it is just a passing test", async () => {
    const { success } = await getUsers();
    expect(success).toBeTruthy();
  });

  it("should get list of templates", async () => {
    const { success, data } = await getTemplates();
    expect(success).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it("it should send message properly", async () => {
    const result = await sendMessage({
      name: "david kraku",
      email: "davidkraku69@gmail.com",
      text: "enquiry about coaching",
    });
  });
});
