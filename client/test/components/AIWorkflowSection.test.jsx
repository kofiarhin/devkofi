import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import AIWorkflowSection from "../../src/components/AIWorkflowSection/AIWorkflowSection";

describe("AIWorkflowSection", () => {
  it("renders the section", () => {
    render(<AIWorkflowSection />);
    expect(
      screen.getByRole("region", { name: /agentic ai workflows/i })
    ).toBeInTheDocument();
  });

  it("renders the main h2 heading", () => {
    render(<AIWorkflowSection />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /how we build with agentic ai workflows/i,
      })
    ).toBeInTheDocument();
  });

  it("renders all 5 block headings", () => {
    render(<AIWorkflowSection />);
    expect(
      screen.getByRole("heading", {
        name: /ai coding mentorship with agentic workflows/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /spec-driven development/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /agentic coding with claude code/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /fix ai hallucinations/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ship full-stack apps fast/i })
    ).toBeInTheDocument();
  });

  it("renders key technology keywords", () => {
    render(<AIWorkflowSection />);
    expect(screen.getAllByText(/claude code/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/codex/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/agentic workflows/i).length).toBeGreaterThan(0);
  });

  it("renders images with alt text and lazy loading", () => {
    render(<AIWorkflowSection />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(5);
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
      expect(img.getAttribute("alt")).not.toBe("");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });
});
