import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ProjectCard, ProjectCollection } from "../src/components/Studio/Studio";

afterEach(cleanup);
const project = {
  key: "agent-system", name: "Agent System", description: "Shared agent instructions.",
  thumbnailUrl: "https://res.cloudinary.com/dlsiabgiw/image/upload/v42/cover.png",
  repoUrl: "https://github.com/kofiarhin/agent-system",
};

describe("ProjectCard media", () => {
  it("offers responsive sources while retaining alt text, lazy loading and reserved space", () => {
    render(<ProjectCard project={project} />);
    const image = screen.getByRole("img", { name: "Agent System preview" });
    expect(image).toHaveAttribute("srcset", expect.stringContaining("320w"));
    expect(image).toHaveAttribute("sizes", expect.stringContaining("900px"));
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveAttribute("width", "1600");
    expect(image).toHaveAttribute("height", "900");
  });

  it("retries the original once if a derived image fails, then displays a stable fallback", () => {
    render(<ProjectCard project={project} />);
    fireEvent.error(screen.getByRole("img", { name: "Agent System preview" }));
    const original = screen.getByRole("img", { name: "Agent System preview" });
    expect(original).toHaveAttribute("src", project.thumbnailUrl);
    expect(original).not.toHaveAttribute("srcset");
    fireEvent.error(original);
    expect(screen.getByRole("img", { name: "Agent System preview unavailable" })).toBeInTheDocument();
    expect(screen.queryByAltText("Agent System preview")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Agent System" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Repository" })).toHaveAttribute("href", project.repoUrl);
  });

  it("shows a fallback without a broken image when no source exists", () => {
    render(<ProjectCard project={{ ...project, thumbnailUrl: undefined }} />);
    expect(screen.getByRole("img", { name: "Agent System preview unavailable" })).toBeInTheDocument();
    expect(screen.queryByAltText("Agent System preview")).not.toBeInTheDocument();
  });

  it("preserves non-Cloudinary URLs and recovers when a failed source is replaced", () => {
    const external = { ...project, thumbnailUrl: "https://example.test/cover.png" };
    const { rerender } = render(<ProjectCard project={external} />);
    const image = screen.getByAltText("Agent System preview");
    expect(image).toHaveAttribute("src", external.thumbnailUrl);
    expect(image).not.toHaveAttribute("srcset");
    fireEvent.error(image);
    expect(screen.getByRole("img", { name: "Agent System preview unavailable" })).toBeInTheDocument();
    rerender(<ProjectCard project={project} />);
    expect(screen.getByAltText("Agent System preview")).toHaveAttribute("srcset");
  });

  it("retains an explicit empty collection state", () => {
    render(<ProjectCollection projects={[]} emptyMessage="No projects available." />);
    expect(screen.getByText("No projects available.")).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
