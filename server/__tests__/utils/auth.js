const { api } = require("./request");

const registerUser = async ({
  fullName = "Test User",
  email = "user@example.com",
  password = "password123",
  pricingId = 1,
  role = "student",
} = {}) => {
  const payload = { fullName, email, password, pricingId, role };
  await api().post("/api/auth/register").send(payload).expect(201);
  return { ...payload };
};

const loginUser = async ({ email, password }) => {
  const response = await api()
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);
  return response.body;
};

const createUserAndToken = async (overrides = {}) => {
  const details = await registerUser(overrides);
  const { token, user } = await loginUser({
    email: details.email,
    password: details.password,
  });
  return { token, user };
};

const authHeader = (token) => `Bearer ${token}`;

module.exports = {
  registerUser,
  loginUser,
  createUserAndToken,
  authHeader,
};
