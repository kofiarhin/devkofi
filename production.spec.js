// production.spec.js
import { test, expect } from "@playwright/test";

// 🔧 Change these to your live URLs
const CLIENT_URL = "https://devkofi.com";
const SERVER_URL = "https://devkofi-api-82532bf8b693.herokuapp.com";

test.describe("Production Smoke Test", () => {
  test("client should load successfully", async ({ page }) => {
    const response = await page.goto(CLIENT_URL, {
      waitUntil: "domcontentloaded",
    });

    // verify page loads
    expect(response.status()).toBeLessThan(400);

    // check for visible UI element (edit based on your app)
  });

  test("server response correctly", async ({ request }) => {
    const result = await request.get(`${SERVER_URL}/api/health`);
    expect(result.status()).toBe(200);
  });
});
