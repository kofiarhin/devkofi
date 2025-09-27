const {
  createNewsletterUser,
  joinMentorship,
  fetchGitHubContributions,
  fetchDailyGitHubContributions,
} = require("../utility/helper");
const Mentorship = require("../Model/mentorshipModel");
const Newsletter = require("../Model/newsletterModel");

describe("Helper utilities", () => {
  it("creates a newsletter user and prevents duplicates", async () => {
    const first = await createNewsletterUser({ email: "unique@test.dev" });
    expect(first).toHaveProperty("_id");

    const duplicate = await createNewsletterUser({ email: "unique@test.dev" });
    expect(duplicate).toEqual({
      success: false,
      error: "user already exist",
    });
  });

  it("handles mentorship creation errors", async () => {
    Mentorship.create.mockImplementationOnce(() => {
      throw new Error("failure");
    });

    const result = await joinMentorship({
      fullName: "Test",
      email: "mentor@test.dev",
    });
    expect(result).toEqual({ success: false, error: "failure" });
  });

  it("creates mentorship entries when the database succeeds", async () => {
    const result = await joinMentorship({
      fullName: "Tester",
      email: "success@test.dev",
    });
    expect(result).toHaveProperty("_id");
  });

  it("returns an error when newsletter creation fails", async () => {
    Newsletter.create.mockImplementationOnce(async () => null);
    const result = await createNewsletterUser({ email: "broken@test.dev" });
    expect(result).toEqual({
      success: false,
      error: "there was a problem createing user please try again",
    });
  });

  it("throws when GitHub credentials are missing", async () => {
    const originalUsername = process.env.GITHUB_USERNAME;
    const originalToken = process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_USERNAME;
    await expect(fetchGitHubContributions()).rejects.toThrow(
      "Missing GITHUB_USERNAME environment variable"
    );
    process.env.GITHUB_USERNAME = "";
    delete process.env.GITHUB_TOKEN;
    await expect(fetchGitHubContributions()).rejects.toThrow(
      "Missing GITHUB_TOKEN environment variable"
    );
    process.env.GITHUB_TOKEN = originalToken;
    process.env.GITHUB_USERNAME = originalUsername;
  });

  it("propagates GitHub API errors for daily contributions", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    }));
    await expect(fetchDailyGitHubContributions()).rejects.toThrow(
      "GitHub API error 500 Internal Server Error"
    );
    global.fetch = originalFetch;
  });

  it("propagates GitHub API errors for total contributions", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(async () => ({
      ok: false,
      statusText: "Bad Request",
    }));
    await expect(fetchGitHubContributions()).rejects.toThrow(
      "GitHub API error: Bad Request"
    );
    global.fetch = originalFetch;
  });

  it("validates missing credentials for daily contributions", async () => {
    const originalToken = process.env.GITHUB_TOKEN;
    const originalUsername = process.env.GITHUB_USERNAME;
    delete process.env.GITHUB_TOKEN;
    await expect(fetchDailyGitHubContributions()).rejects.toThrow(
      "Missing GITHUB_TOKEN"
    );
    process.env.GITHUB_TOKEN = originalToken;
    delete process.env.GITHUB_USERNAME;
    await expect(fetchDailyGitHubContributions()).rejects.toThrow(
      "Missing GITHUB_USERNAME"
    );
    process.env.GITHUB_USERNAME = originalUsername;
  });
});
