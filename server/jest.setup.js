const path = require("path");
const dotenv = require("dotenv");

process.env.DOTENV_CONFIG_QUIET = "true";
dotenv.config({
  path: path.resolve(process.cwd(), ".env.test.example"),
  override: true,
  quiet: true,
});

jest.mock("./utility/sendEmail", () => jest.fn(async () => true));

const { connectDB, clearDB, closeDB } = require("./__tests__/utils/db");
const { setupModelMocks } = require("./__tests__/utils/modelMocks");

setupModelMocks();

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
  jest.clearAllMocks();
});

afterAll(async () => {
  await closeDB();
});
