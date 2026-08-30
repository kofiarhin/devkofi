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
  it("publishes canonical metadata and service schema for the services page", async () => {
    renderMeta("/services");

    await waitFor(() => {
      expect(document.title).toBe("AI Engineering Services | DevKofi");
    });

    expect(document.querySelector('meta[name="description"]')?.content).toContain("AI systems engineering");
    expect(document.querySelector('meta[property="og:url"]')?.content).toBe("https://devkofi.com/services");
    expect(document.querySelector('link[rel="canonical"]')?.href).toBe("https://devkofi.com/services");

    const schema = JSON.parse(document.getElementById("devkofi-page-jsonld").textContent);
    expect(schema.name).toBe("DevKofi AI Engineering Services");
    expect(schema.mainEntity.itemListElement).toHaveLength(3);
    expect(schema.mainEntity.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      item: { "@type": "Service", name: "AI systems engineering" },
    });
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
    expect(getSeoForPath("/templates").canonicalPath).toBe("/engineering-systems");
  });
});
