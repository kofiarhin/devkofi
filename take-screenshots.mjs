import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projects = [
  { name: "crypto-pulse-pro", url: "https://crypto-pulse-pro.vercel.app/", wait: 6000 },
];

const outputDir = path.join(__dirname, "_screenshots");

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const project of projects) {
    console.log(`Screenshotting ${project.name} at ${project.url}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
      await page.goto(project.url, {
        waitUntil: "networkidle2",
        timeout: 45000,
      });

      await new Promise((r) => setTimeout(r, project.wait || 2000));

      const outputPath = path.join(outputDir, `${project.name}.png`);
      await page.screenshot({ path: outputPath, fullPage: false });
      console.log(`  Saved: ${outputPath}`);
    } catch (err) {
      console.error(`  Failed for ${project.name}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("Done.");
}

takeScreenshots();
