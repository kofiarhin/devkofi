const errorHandler = require("../middleware/errorHandler");

const createResponse = () => {
  const res = {
    statusCode: 200,
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res;
};

describe("error handler", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.clearAllMocks();
  });

  it("defaults to a 500 status when none is set", () => {
    process.env.NODE_ENV = "test";
    const res = createResponse();
    const error = new Error("boom");

    errorHandler(error, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "boom" });
  });

  it("preserves an explicit status code and includes stack traces in development", () => {
    process.env.NODE_ENV = "development";
    const res = createResponse();
    res.statusCode = 404;
    const error = new Error("missing");

    errorHandler(error, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: "missing",
        stack: expect.stringContaining("Error: missing"),
      })
    );
  });
});
