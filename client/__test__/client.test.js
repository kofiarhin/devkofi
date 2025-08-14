import { describe, it } from "vitest";
import { joinNewsletter } from "../src/hooks/useJoinNewsletterMutation";
import { getGitHubInfo, getUsers } from "../src/services/services";

describe("app test", () => {
  // it("should just pass", async () => {
  //   const result = await joinNewsletter({ email: "davidkraku69@gmail.com" });
  // });

  it("should get github ionfo", async () => {
    const result = await getGitHubInfo();
    console.log({ newData: result });
  });
});
