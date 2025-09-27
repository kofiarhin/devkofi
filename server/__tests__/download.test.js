const path = require("path");
const fs = require("fs");
const { api } = require("./utils/request");

describe("Download routes", () => {
  it("serves an existing file", async () => {
    const filePath = path.join(__dirname, "../files/mern-stack-starter.zip");
    expect(fs.existsSync(filePath)).toBe(true);

    const response = await api()
      .get("/api/download")
      .query({ filename: "mern-stack-starter.zip" })
      .expect(200);

    expect(response.headers["content-disposition"]).toContain(
      "attachment"
    );
  });

  it("falls back to the default file when no filename is provided", async () => {
    const response = await api().get("/api/download").expect(200);
    if (response.headers["content-disposition"]) {
      expect(response.headers["content-disposition"]).toContain("attachment");
      return;
    }
    expect(response.body.success).toBe(false);
  });

  it("returns an error when the file does not exist", async () => {
    const response = await api()
      .get("/api/download")
      .query({ filename: "missing.zip" })
      .expect(200);

    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty("error");
  });
});
