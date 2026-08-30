import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SEO from "../../src/components/SEO/SEO";
import { getSeoForPath, SEO_BY_PATH } from "../../src/constants/seo";

afterEach(() => {
  cleanup();
  document.getElementById("devkofi-page-jsonld")?.remove();
  document.head.querySelector('link[rel="canonical"]')?.remove();
});

describe("DevKofi route SEO metadata", () => {
  it("defines unique titles and descriptions for the seven canonical studio routes", () => {
    const routes = ["/", "/work", "/services", "/about", "/lab", "/journal", "/start-a-project"];
    const entries = routes.map((route) => SEO_BY_PATH[route]);

    expect(entries.every(Boolean)).toBe(true);
    expect(new Set(entries.map((entry) => entry.title)).size).toBe(routes.length);
    expect(new Set(entries.map((entry) => entry.description)).size).toBe(routes.length);
    expect(entries.every((entry) => entry.structuredData)).toBe(true);
  });

  it("maps legacy public routes to their canonical studio metadata", () => {
    expect(getSeoForPath("/projects").path).toBe("/work");
    expect(getSeoForPath("/templates").path).toBe("/lab");
    expect(getSeoForPath("/contact").path).toBe("/start-a-project");
    expect(getSeoForPath("/book-a-call").path).toBe("/start-a-project");
  });

  it("marks admin, verification and unknown routes noindex", () => {
    expect(getSeoForPath("/admin/login").robots).toBe("noindex,follow");
    expect(getSeoForPath("/newsletter/verify").robots).toBe("noindex,follow");
    expect(getSeoForPath("/not-a-real-page").robots).toBe("noindex,follow");
  });

  it("writes canonical, social and structured metadata to the document head", async () => {
    const servicesSeo = getSeoForPath("/services");
    render(<SEO {...servicesSeo} />);

    await waitFor(() => {
      expect(document.title).toBe(servicesSeo.title);
    });

    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute("content", servicesSeo.description);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", expect.stringContaining("index,follow"));
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute("content", "https://devkofi.com/services");
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://devkofi.com/services");

    const schema = JSON.parse(document.getElementById("devkofi-page-jsonld").textContent);
    expect(schema.name).toBe("DevKofi Services");
    expect(schema.mainEntity.itemListElement).toHaveLength(3);
  });
});
