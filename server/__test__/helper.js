const app = require("../app");
const request = require("supertest");

const mockRegisterUser = async (userData) => {
  const { statusCode, body } = await request(app)
    .post("/api/auth/register")
    .send(userData);
  if (statusCode === 201) {
    return body;
  }
};

const mockLoginUser = async (userData) => {
  const { email, password } = userData;
  const { statusCode, body } = await request(app)
    .post("/api/auth/login")
    .send({ email, password });
  if (statusCode === 200) {
    return { statusCode, body };
  }
  return { statusCode, body };
};

const fullAuth = async (userData) => {
  await mockRegisterUser(userData);
  const result = await mockLoginUser(userData);
  return result;
};

module.exports = {
  mockRegisterUser,
  mockLoginUser,
  fullAuth,
};
