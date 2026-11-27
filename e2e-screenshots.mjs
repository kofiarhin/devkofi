import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:5173";
const OUT = "screenshots";
const PAGES = [
  { name: "home", path: "/" },
  { name: "ai-integration", path: "/ai-integration" },
  { name: "mentorship", path: "/mentorship" },
  { name: "work", path: "/work" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "book-a-call", path: "/book-a-call" },
];
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: "reduce",
    colorScheme: "dark",
  });
  const page = await context.newPage();

  for (const pg of PAGES) {
    const url = `${BASE}${pg.path}`;
    console.log(`  ${vp.name} (${vp.width}px) → ${pg.name}`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${OUT}/${pg.name}-${vp.name}-${vp.width}.png`,
      fullPage: true,
    });
  }

  await context.close();
}

// Accessibility checks on desktop
console.log("\n--- Accessibility checks ---");
const a11yContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
});
const a11yPage = await a11yContext.newPage();

for (const pg of PAGES) {
  await a11yPage.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle" });
  await a11yPage.waitForTimeout(300);

  // Check for missing alt text on images
  const imgsMissingAlt = await a11yPage.$$eval("img:not([alt])", (imgs) =>
    imgs.map((img) => img.src)
  );
  if (imgsMissingAlt.length > 0) {
    console.log(`  [WARN] ${pg.name}: ${imgsMissingAlt.length} image(s) missing alt`);
    imgsMissingAlt.forEach((src) => console.log(`         ${src}`));
  }

  // Check focusable elements have visible outlines (tab through first 20)
  const focusIssues = await a11yPage.evaluate(() => {
    const issues = [];
    const focusable = document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const subset = Array.from(focusable).slice(0, 20);
    for (const el of subset) {
      el.focus();
      const style = window.getComputedStyle(el);
      const outline = style.outlineStyle;
      const boxShadow = style.boxShadow;
      if (outline === "none" && boxShadow === "none") {
        issues.push({
          tag: el.tagName,
          text: el.textContent?.slice(0, 40),
          classes: el.className?.slice(0, 60),
        });
      }
    }
    return issues;
  });
  if (focusIssues.length > 0) {
    console.log(`  [WARN] ${pg.name}: ${focusIssues.length} element(s) may lack visible focus`);
    focusIssues.forEach((el) => console.log(`         <${el.tag}> "${el.text}" .${el.classes}`));
  }

  // Check for console errors
  const consoleErrors = [];
  a11yPage.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  if (imgsMissingAlt.length === 0 && focusIssues.length === 0) {
    console.log(`  [OK] ${pg.name}: no a11y issues found`);
  }
}

// Reduced motion check
console.log("\n--- Reduced motion check ---");
const rmContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
  colorScheme: "dark",
});
const rmPage = await rmContext.newPage();
await rmPage.goto(`${BASE}/`, { waitUntil: "networkidle" });
await rmPage.waitForTimeout(500);

const rmResult = await rmPage.evaluate(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const floatingPanels = document.querySelector(".site-float-panels");
  const floatingHidden =
    floatingPanels && window.getComputedStyle(floatingPanels).display === "none";
  return { reducedMotionActive: mq.matches, floatingPanelsHidden: floatingHidden };
});
console.log(`  prefers-reduced-motion detected: ${rmResult.reducedMotionActive}`);
console.log(`  floating panels hidden in reduced motion: ${rmResult.floatingPanelsHidden}`);

await rmPage.screenshot({
  path: `${OUT}/home-reduced-motion.png`,
  fullPage: true,
});
console.log("  Saved home-reduced-motion.png");

await rmContext.close();
await a11yContext.close();
await browser.close();

console.log(`\nDone. Screenshots saved to ${OUT}/`);
