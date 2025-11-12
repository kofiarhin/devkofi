import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5174";

test.beforeEach(async ({ page }) => {
  await page.goto(BASE);
});
test.describe("home page test", () => {
  test("passing test", async ({ page }) => {
    const pageTitle = await page.title();
    console.log({ pageTitle });
    expect(pageTitle).toContain("DevKofi");
  });

  test("pricing is showing properly", async ({ page }) => {
    await page.goto("http://localhost:5174"); // ✅ load your running site
    await page.waitForSelector(".pricing .heading", { timeout: 10000 }); // ✅ wait for it to appear
    const pricingElement = page.locator(".pricing .heading");
    await expect(pricingElement).toBeVisible(); // ✅ assert visibility
    await expect(pricingElement).toHaveText("Pricing"); // ✅ confirm it shows correct text
  });
});
