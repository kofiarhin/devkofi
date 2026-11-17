import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { PageMeta } from "../../src/components/Studio/Studio";
import { getSeoForPath } from "../../src/constants/seo";

afterEach(() => {
  cleanup();
  document.getElementById("devkofi-page-jsonld")?.remove();
  document.head.querySelector('link[rel="canonical"]')?.remove();
});

const renderMeta = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PageMeta />
    </MemoryRouter>,
  );

describe("DevKofi route SEO metadata", () => {
  it("publishes canonical metadata and the three services on the home page", async () => {
    renderMeta("/");

    await waitFor(() => {
      expect(document.title).toBe("DevKofi | AI Engineer with Real MERN Stack Experience");
    });

    expect(document.querySelector('link[rel="canonical"]')?.href).toBe("https://devkofi.com/");
    const schema = JSON.parse(document.getElementById("devkofi-page-jsonld").textContent);
    expect(schema.mainEntity.itemListElement.map((entry) => entry.item.name)).toEqual([
      "AI integration into existing systems",
      "AI engineering mentorship",
      "MERN stack mentorship",
    ]);
  });

  it.each([
    ["/ai-integration", "AI Integration into Existing Systems | DevKofi"],
    ["/mentorship", "1-on-1 AI Engineering & MERN Stack Mentorship | DevKofi"],
    ["/work", "Work & Case Studies: Hibachi, Brain, EscoWear | DevKofi"],
    ["/about", "About Kofi Arhin | AI Engineer and Mentor | DevKofi"],
    ["/book-a-call", "Book a Free Intro Call | DevKofi"],
  ])("publishes unique title, description, canonical, Open Graph and Twitter tags for %s", async (path, title) => {
    renderMeta(path);

    await waitFor(() => {
      expect(document.title).toBe(title);
    });

    const url = `https://devkofi.com${path}`;
    const description = document.querySelector('meta[name="description"]')?.content;
    expect(description).toBeTruthy();
    expect(description).not.toMatch(/[£$€]\s?\d/);
    expect(document.querySelector('link[rel="canonical"]')?.href).toBe(url);
    expect(document.querySelector('meta[property="og:url"]')?.content).toBe(url);
    expect(document.querySelector('meta[property="og:title"]')?.content).toBe(title);
    expect(document.querySelector('meta[property="og:description"]')?.content).toBe(description);
    expect(document.querySelector('meta[name="twitter:title"]')?.content).toBe(title);
    expect(document.querySelector('meta[name="twitter:description"]')?.content).toBe(description);
  });

  it("keeps every public page title and description unique", () => {
    const paths = ["/", "/ai-integration", "/mentorship", "/work", "/about", "/book-a-call", "/contact", "/blog"];
    const metas = paths.map(getSeoForPath);
    expect(new Set(metas.map((meta) => meta.title)).size).toBe(paths.length);
    expect(new Set(metas.map((meta) => meta.description)).size).toBe(paths.length);
  });

  it("marks private routes noindex", async () => {
    renderMeta("/admin/login");

    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')?.content).toBe("noindex,follow");
    });
  });

  it("keeps legacy URLs mapped to current canonical destinations", () => {
    expect(getSeoForPath("/projects").canonicalPath).toBe("/work");
    expect(getSeoForPath("/products").canonicalPath).toBe("/work");
    expect(getSeoForPath("/templates").canonicalPath).toBe("/work");
    expect(getSeoForPath("/engineering-systems").canonicalPath).toBe("/work");
    expect(getSeoForPath("/systems").canonicalPath).toBe("/work");
    expect(getSeoForPath("/services").canonicalPath).toBe("/ai-integration");
    expect(getSeoForPath("/ai-workflow-audit").canonicalPath).toBe("/ai-integration");
  });
});
