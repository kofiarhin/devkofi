const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  } else if (mongoose.connection.readyState !== 1) {
    // connectDB() in app.js already started — wait for it to finish
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('CORS', () => {
  it('echoes back an allowed origin with credentials enabled', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('does not set Access-Control-Allow-Origin for an unlisted origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://evil.example.com');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('handles a preflight OPTIONS request from an allowed origin', async () => {
    const res = await request(app)
      .options('/api/contact')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
    expect(res.headers['access-control-allow-methods']).toMatch(/POST/);
  });

  it('does not set CORS headers on preflight from an unlisted origin', async () => {
    const res = await request(app)
      .options('/api/contact')
      .set('Origin', 'https://evil.example.com')
      .set('Access-Control-Request-Method', 'POST');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Health check', () => {
  it('returns db state 1 (connected) when mongoose is connected', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.db).toBe(1);
    expect(res.body.message).toBe('ok');
  });

  it('/health also returns db state', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.db).toBe(1);
  });
});
