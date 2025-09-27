const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const cleaner = require("../middlewares/cleaner");
const User = require("../Model/userModel");

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

const getCorsMiddleware = () => require("../middleware/cors");

describe("CORS middleware", () => {
  afterEach(() => {
    process.env.NODE_ENV = originalEnv.NODE_ENV;
    process.env.CORS_ORIGIN = originalEnv.CORS_ORIGIN;
    jest.resetModules();
  });

  it("reflects the request origin outside production", async () => {
    process.env.NODE_ENV = "test";
    jest.resetModules();
    const createCors = getCorsMiddleware();
    const app = express();
    app.use(createCors());
    app.get("/ping", (req, res) => res.json({ ok: true }));

    const response = await request(app)
      .get("/ping")
      .set("Origin", "http://localhost:3000")
      .expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3000"
    );
  });

  it("restricts origins in production", async () => {
    process.env.NODE_ENV = "production";
    process.env.CORS_ORIGIN = "https://devkofi.com,https://preview.devkofi.com";
    jest.resetModules();
    const createCors = getCorsMiddleware();
    const app = express();
    app.use(createCors());
    app.get("/ping", (req, res) => res.json({ ok: true }));
    app.use((error, req, res, next) => {
      res.status(500).json({ error: error.message });
    });

    const allowed = await request(app)
      .get("/ping")
      .set("Origin", "https://devkofi.com")
      .expect(200);

    expect(allowed.headers["access-control-allow-origin"]).toBe(
      "https://devkofi.com"
    );

    const blocked = await request(app)
      .get("/ping")
      .set("Origin", "https://malicious.dev")
      .expect(500);

    expect(blocked.body.error).toBe("Not allowed by CORS");
  });

  it("allows server-to-server requests without an Origin header", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.CORS_ORIGIN;
    jest.resetModules();
    const createCors = getCorsMiddleware();
    const app = express();
    app.use(createCors());
    app.get("/ping", (req, res) => res.json({ ok: true }));

    const response = await request(app).get("/ping").expect(200);

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("defaults to devkofi.com when no production origins are defined", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.CORS_ORIGIN;
    jest.resetModules();
    const createCors = getCorsMiddleware();
    const app = express();
    app.use(createCors());
    app.get("/ping", (req, res) => res.json({ ok: true }));

    const response = await request(app)
      .get("/ping")
      .set("Origin", "https://devkofi.com")
      .expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe("https://devkofi.com");
  });

  it("uses the development fallback when NODE_ENV is unset", async () => {
    delete process.env.NODE_ENV;
    jest.resetModules();
    const createCors = getCorsMiddleware();
    const app = express();
    app.use(createCors());
    app.get("/ping", (req, res) => res.json({ ok: true }));

    const response = await request(app)
      .get("/ping")
      .set("Origin", "http://localhost:4000")
      .expect(200);

    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:4000");
  });
});

describe("Auth middleware", () => {
  const createApp = () => {
    const app = express();
    app.get("/secure", auth, (req, res) => res.json({ ok: true, user: req.user }));
    return app;
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects requests when the bearer token is empty", async () => {
    const app = createApp();
    const response = await request(app)
      .get("/secure")
      .set("Authorization", "Bearer ")
      .expect(500);

    expect(response.body.error).toBe("unauthorized: no token");
  });

  it("rejects requests when the user cannot be resolved", async () => {
    jest.spyOn(jwt, "verify").mockReturnValue({ id: "missing" });
    jest.spyOn(User, "findById").mockResolvedValueOnce(null);

    const app = createApp();
    const response = await request(app)
      .get("/secure")
      .set("Authorization", "Bearer token")
      .expect(500);

    expect(response.body.error).toBe("user not found");
  });
});

describe("Cleaner middleware", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("skips database cleanup outside development", async () => {
    process.env.NODE_ENV = "test";
    const next = jest.fn();
    await cleaner({}, {}, next);
    expect(next).toHaveBeenCalled();
  });

  it("invokes next in development mode", async () => {
    process.env.NODE_ENV = "development";
    const next = jest.fn();
    await cleaner({}, {}, next);
    expect(next).toHaveBeenCalled();
  });
});
