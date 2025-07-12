import { describe, expect, it } from "vitest";
import {
  getUsers,
  getTemplates,
  sendMessage,
  downloadFile,
} from "../src/services/services";
describe("app", () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(
      () => "blob:http://localhost/fake-blob-url"
    );
  });
  it("it is just a passing test", async () => {
    const { success } = await getUsers();
    expect(success).toBeTruthy();
  });

  it("should get list of templates", async () => {
    const { success, data } = await getTemplates();
    // expect(success).toBeTruthy();
    // expect(data.length).toBeGreaterThan(0);
  });

  // it("it should send message properly", async () => {
  //   const result = await sendMessage({
  //     name: "david kraku",
  //     email: "davidkraku69@gmail.com",
  //     text: "enquiry about coaching",
  //   });
  // });
  it("should download file properly", async () => {
    const result = await downloadFile();
    expect(result).not.toBeTruthy();
  });
});
