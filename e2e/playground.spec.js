import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5174";

// test.beforeEach(async ({ page }) => {
//   await page.goto(BASE);
// });

// test.describe("home page test", () => {
//   test("passing test", async ({ page }) => {
//     const pageTitle = await page.title();
//     console.log({ pageTitle });
//     expect(pageTitle).toContain("DevKofi");
//   });

//   test("pricing is showing properly", async ({ page }) => {
//     await page.goto("http://localhost:5174");
//     await page.waitForSelector(".pricing .heading", { timeout: 10000 });
//     const pricingElement = page.locator(".pricing .heading");
//     await expect(pricingElement).toBeVisible();
//     await expect(pricingElement).toHaveText("Pricing");
//   });
// });

test.describe("Courses Page", () => {
  test("passing courses test", async ({ page }) => {
    await page.goto(`${BASE}/courses`);

    // get list of courses
    const courseItems = page.locator("#course-list .course-item");

    await expect(courseItems).toHaveCount(4);
    await page.waitForTimeout(5000);
  });
});
