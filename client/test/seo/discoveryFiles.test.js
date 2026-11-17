import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const publicDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../../public");
const readPublicFile = (name) => readFileSync(resolve(publicDirectory, name), "utf8");

const canonicalRoutes = [
  "https://devkofi.com/",
  "https://devkofi.com/ai-integration",
  "https://devkofi.com/mentorship",
  "https://devkofi.com/work",
  "https://devkofi.com/about",
  "https://devkofi.com/contact",
  "https://devkofi.com/book-a-call",
  "https://devkofi.com/blog",
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
    expect(sitemap).not.toContain("/services</loc>");
    expect(sitemap).not.toContain("/engineering-systems</loc>");
    expect(sitemap).not.toContain("/blog/");
  });

  it("allows public search crawlers and points them to the sitemap", () => {
    const robots = readPublicFile("robots.txt");

    expect(robots).toContain("User-agent: OAI-SearchBot");
    expect(robots).toContain("User-agent: ClaudeBot");
    expect(robots).toContain("User-agent: PerplexityBot");
    expect(robots).toContain("Sitemap: https://devkofi.com/sitemap.xml");
    expect(robots).toContain("Disallow: /admin/");
  });

  it("describes the current services without presenting llms.txt as a ranking mechanism", () => {
    const llms = readPublicFile("llms.txt");

    expect(llms).toContain("AI engineer with real MERN stack experience");
    expect(llms).toContain("https://devkofi.com/ai-integration");
    expect(llms).toContain("https://devkofi.com/mentorship");
    expect(llms).toContain("Do not infer shipped capabilities");
    expect(llms).toContain("not presented as a Google Search ranking mechanism");
  });
});
