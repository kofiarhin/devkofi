import fs from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path) => fs.readFileSync(path, "utf8");

const themeSources = [
  "src/main.styles.scss",
  "src/Pages/Home/home.styles.scss",
  "src/Pages/About/about.styles.scss",
  "src/components/Header/header.styles.scss",
  "src/components/SideNav/sideNav.styles.scss",
  "src/Pages/Footer/footer.styles.scss",
].map(read).join("\n");

describe("DevKofi studio theme", () => {
  it("uses the original lime accent on a dark public canvas", () => {
    const homeTheme = read("src/Pages/Home/home.styles.scss");

    expect(homeTheme).toContain("$canvas: #09090b");
    expect(homeTheme).toContain("$accent: #94ff2b");
    expect(homeTheme).not.toMatch(/background:\s*\$paper/);
  });

  it("removes the redesign copper and ivory palette from shared studio surfaces", () => {
    expect(themeSources).not.toMatch(/#bd6845|#d98763|#eee9df|#ded6c8/i);
  });
});
