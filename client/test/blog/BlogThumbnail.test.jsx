import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlogThumbnail from "../../src/components/BlogThumbnail";
import { ACCENT_COLORS, getAccentColor, getThumbnailWords } from "../../src/lib/blogThumbnail";

const renderThumbnail = (props) => render(<BlogThumbnail {...props} />).container.firstChild;

describe("BlogThumbnail", () => {
  it("keeps at most six words from the title", () => {
    expect(getThumbnailWords("  One two   three four five six seven eight ")).toEqual(
      ["One", "two", "three", "four", "five", "six"],
    );

    const thumbnail = renderThumbnail({ title: "One two three four five six seven", slug: "a" });
    const words = thumbnail.querySelectorAll(".blog-text-thumbnail__word");
    expect(words).toHaveLength(6);
    expect(thumbnail.querySelector(".blog-text-thumbnail__title")).toHaveTextContent(/^One two three four five six$/);
  });

  it("highlights only the last displayed word", () => {
    const thumbnail = renderThumbnail({ title: "Tool contracts make agents safer in production", slug: "tool-contracts" });
    const accents = thumbnail.querySelectorAll(".blog-text-thumbnail__accent");

    expect(accents).toHaveLength(1);
    expect(accents[0]).toHaveTextContent(/^in$/);
    expect(thumbnail.querySelector(".blog-text-thumbnail__word:last-child")).toBe(accents[0]);
  });

  it("highlights a single-word title and falls back when the title is empty", () => {
    expect(renderThumbnail({ title: "Retries", slug: "r" }).querySelector(".blog-text-thumbnail__accent"))
      .toHaveTextContent(/^Retries$/);

    const fallback = renderThumbnail({ title: "   ", slug: "empty" });
    expect(fallback.querySelector(".blog-text-thumbnail__title")).toHaveTextContent(/^From the journal$/);
    expect(fallback.querySelector(".blog-text-thumbnail__accent")).toHaveTextContent(/^journal$/);
  });

  it("picks the accent colour consistently from the slug", () => {
    const slug = "reliable-agent-retries-need-contracts";
    const accent = getAccentColor(slug);

    expect(ACCENT_COLORS).toEqual(["blue", "orange", "green", "red"]);
    expect(ACCENT_COLORS).toContain(accent);
    expect(getAccentColor(slug)).toBe(accent);

    const first = renderThumbnail({ title: "First title", slug });
    const second = renderThumbnail({ title: "A completely different title", slug });
    expect(first.dataset.accent).toBe(accent);
    expect(second.dataset.accent).toBe(accent);
    expect(first).toHaveClass(`blog-text-thumbnail--accent-${accent}`);
  });

  it("spreads slugs across all four accent colours", () => {
    const used = new Set(Array.from({ length: 40 }, (_, index) => getAccentColor(`post-${index}`)));
    expect([...used].sort()).toEqual([...ACCENT_COLORS].sort());
  });

  it("is decorative and keeps the caller's class", () => {
    const thumbnail = renderThumbnail({ title: "Hello world", slug: "hello", className: "blog-story__visual" });
    expect(thumbnail).toHaveAttribute("aria-hidden", "true");
    expect(thumbnail).toHaveClass("blog-text-thumbnail", "blog-story__visual");
  });
});
