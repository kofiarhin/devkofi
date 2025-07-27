import { describe, it } from "vitest";
import { joinNewsletter } from "../src/hooks/useJoinNewsletterMutation";

describe("app test", () => {
  it("should just pass", async () => {
    const result = await joinNewsletter({ email: "davidkraku69@gmail.com" });
  });
});
