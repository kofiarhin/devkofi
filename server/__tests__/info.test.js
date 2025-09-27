const { api } = require("./utils/request");

describe("Info routes", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    if (global.fetch && jest.isMockFunction(global.fetch)) {
      global.fetch.mockReset();
    }
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("returns a placeholder message for the base info route", async () => {
    const response = await api().get("/api/info").expect(200);
    expect(response.body).toEqual({ message: "get info" });
  });

  it("returns GitHub contribution totals", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 42,
              },
            },
          },
        },
      }),
    });
    const response = await api().get("/api/info/github").expect(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(response.body).toBe(42);
  });

  it("returns GitHub daily contributions when requested", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                weeks: [
                  {
                    contributionDays: [
                      { date: "2024-01-01", contributionCount: 5 },
                    ],
                  },
                ],
              },
            },
          },
        },
      }),
    });
    const response = await api().get("/api/info/github?query=daily").expect(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual([{ date: "2024-01-01", count: 5 }]);
  });

  it("returns a 400 error for invalid queries", async () => {
    const response = await api().get("/api/info/github?query=invalid").expect(400);
    expect(response.body).toEqual({ success: false, error: "ïnvalid query" });
  });
});
