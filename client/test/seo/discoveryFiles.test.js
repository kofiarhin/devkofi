import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readPublicFile = (name) => readFileSync(new URL(`../../public/${name}`, import.meta.url), "utf8");

const canonicalRoutes = [
  "https://devkofi.com/",
  "https://devkofi.com/services",
  "https://devkofi.com/work",
  "https://devkofi.com/engineering-systems",
  "https://devkofi.com/about",
  "https://devkofi.com/contact",
  "https://devkofi.com/book-a-call",
];

describe("DevKofi crawler discovery files", () => {
  it("publishes the current canonical route set in sitemap.xml", () => {
    const sitemap = readPublicFile("sitemap.xml");

    canonicalRoutes.forEach((route) => {
      expect(sitemap).toContain(`<loc>${route}</loc>`);
    });

    expect(sitemap).not.toContain("/projects</loc>");
    expect(sitemap).not.toContain("/products</loc>");
    expect(sitemap).not.toContain("/templates</loc>");
  });

  it("allows public search crawlers and points them to the sitemap", () => {
    const robots = readPublicFile("robots.txt");

    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("User-agent: ClaudeBot");
    expect(robots).toContain("User-agent: PerplexityBot");
    expect(robots).toContain("Sitemap: https://devkofi.com/sitemap.xml");
    expect(robots).toContain("Disallow: /admin/");
  });

  it("describes the current AI engineering studio without presenting llms.txt as a ranking mechanism", () => {
    const llms = readPublicFile("llms.txt");

    expect(llms).toContain("AI engineering studio");
    expect(llms).toContain("Engineering Systems");
    expect(llms).toContain("Do not infer shipped capabilities");
    expect(llms).toContain("not presented as a Google Search ranking mechanism");
  });
});
