const express = require("express");
const request = require("supertest");

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
});
