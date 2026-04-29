import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AIWorkflowSection from "../../src/components/AIWorkflowSection/AIWorkflowSection";

const renderSection = () =>
  render(
    <MemoryRouter>
      <AIWorkflowSection />
    </MemoryRouter>
  );

describe("AIWorkflowSection", () => {
  it("renders the section", () => {
    renderSection();
    expect(
      screen.getByRole("region", { name: /the ai engineering workflow i teach/i })
    ).toBeInTheDocument();
  });

  it("renders the main h2 heading", () => {
    renderSection();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /the ai engineering workflow i teach/i,
      })
    ).toBeInTheDocument();
  });

  it("renders all 5 block headings", () => {
    renderSection();
    expect(
      screen.getByRole("heading", {
        name: /build inside a real production workflow/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /turn ideas into specs and architecture/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /code with agents without losing control/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /verify outputs before they reach production/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ship full-stack apps with tests and deployment/i })
    ).toBeInTheDocument();
  });

  it("renders key technology keywords", () => {
    renderSection();
    expect(screen.getAllByText(/claude code/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/codex/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/agent workflows/i).length).toBeGreaterThan(0);
  });

  it("renders section CTAs linking to contact", () => {
    renderSection();
    const labels = [
      /start the workflow/i,
      /plan my system/i,
      /build with ai agents/i,
      /make code reliable/i,
      /ship my full-stack app/i,
    ];

    labels.forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        "/contact"
      );
    });
  });

  it("renders images with alt text and lazy loading", () => {
    renderSection();
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(5);
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });
});
