const request = require("supertest");
const app = require("../app");

const loginUser = async (userData) => {
  const { statusCode, body } = await request(app)
    .post("/api/auth/login")
    .send(userData);
  return { statusCode, body };
};
const registerUser = async (userData) => {
  const { statusCode, body } = await request(app)
    .post("/api/auth/register")
    .send(userData);
  return { statusCode, body };
};

module.exports = {
  loginUser,
  registerUser,
};
