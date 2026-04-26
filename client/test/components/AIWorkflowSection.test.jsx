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
      screen.getByRole("region", { name: /the agentic ai workflow i teach/i })
    ).toBeInTheDocument();
  });

  it("renders the main h2 heading", () => {
    renderSection();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /the agentic ai workflow i teach/i,
      })
    ).toBeInTheDocument();
  });

  it("renders all 5 block headings", () => {
    renderSection();
    expect(
      screen.getByRole("heading", {
        name: /build inside a real ai engineering workflow/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ai-powered system design/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /agentic coding with claude code/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /eliminate ai hallucinations/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ship full-stack applications faster/i })
    ).toBeInTheDocument();
  });

  it("renders key technology keywords", () => {
    renderSection();
    expect(screen.getAllByText(/claude code/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/codex/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/agentic workflows/i).length).toBeGreaterThan(0);
  });

  it("renders section CTAs linking to contact", () => {
    renderSection();
    const labels = [
      /start this workflow/i,
      /plan my system/i,
      /build with ai agents/i,
      /make my code reliable/i,
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
