import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readPublicFile = (name) =>
  readFileSync(new URL(`../../public/${name}`, import.meta.url), "utf8");

const canonicalRoutes = [
  "https://devkofi.com/",
  "https://devkofi.com/work",
  "https://devkofi.com/services",
  "https://devkofi.com/about",
  "https://devkofi.com/lab",
  "https://devkofi.com/journal",
  "https://devkofi.com/start-a-project",
];

describe("public SEO discovery files", () => {
  it("publishes only the seven canonical studio routes in the sitemap", () => {
    const sitemap = readPublicFile("sitemap.xml");

    canonicalRoutes.forEach((route) => {
      expect(sitemap).toContain(`<loc>${route}</loc>`);
    });

    expect((sitemap.match(/<url>/g) || []).length).toBe(canonicalRoutes.length);
    expect(sitemap).not.toContain("/admin");
    expect(sitemap).not.toContain("/projects");
    expect(sitemap).not.toContain("/templates");
  });

  it("allows search and selected AI discovery crawlers and advertises the sitemap", () => {
    const robots = readPublicFile("robots.txt");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("User-agent: GPTBot");
    expect(robots).toContain("User-agent: ClaudeBot");
    expect(robots).toContain("User-agent: PerplexityBot");
    expect(robots).toContain("Sitemap: https://devkofi.com/sitemap.xml");
  });

  it("provides an accurate machine-readable DevKofi navigation summary", () => {
    const llms = readPublicFile("llms.txt");

    expect(llms).toContain("DevKofi is Kofi Arhin's founder-led creative technology studio");
    canonicalRoutes.forEach((route) => {
      expect(llms).toContain(route);
    });
    expect(llms).toContain("Do not infer shipped capabilities");
  });
});
