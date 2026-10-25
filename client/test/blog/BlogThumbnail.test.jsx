import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BlogThumbnail from "../../src/components/BlogThumbnail";
import { getLastLineStart, getThumbnailWords } from "../../src/lib/blogThumbnail";

const renderThumbnail = (props) => render(<BlogThumbnail {...props} />).container.firstChild;
const accentText = (thumbnail) =>
  Array.from(thumbnail.querySelectorAll(".blog-text-thumbnail__accent")).map((el) => el.textContent).join(" ");

// jsdom has no layout, so simulate wrapping: each word's offsetTop comes from `lineOfWord`.
const mockWrapping = (lineOfWord, lineHeight = 40) => {
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function offsetTop() {
    if (!this.classList.contains("blog-text-thumbnail__word")) return 0;
    const index = Number(this.style.getPropertyValue("--word-index"));
    return lineOfWord[index] * lineHeight;
  });
};

afterEach(() => vi.restoreAllMocks());

describe("getLastLineStart", () => {
  it("returns the first word on the last line", () => {
    expect(getLastLineStart([0, 0, 40, 40])).toBe(2);
    expect(getLastLineStart([0, 0, 40, 40, 80])).toBe(4);
    expect(getLastLineStart([0, 40, 40, 80, 80, 80])).toBe(3);
  });

  it("treats sub-pixel differences as the same line", () => {
    expect(getLastLineStart([0, 0.5, 40, 41.5])).toBe(2);
  });

  it("ignores words clipped below the visible height", () => {
    expect(getLastLineStart([0, 40, 80, 120], 100)).toBe(2);
  });

  it("falls back to the last word for a single line", () => {
    expect(getLastLineStart([0, 0, 0])).toBe(2);
    expect(getLastLineStart([])).toBe(0);
  });
});

describe("BlogThumbnail", () => {
  it("keeps at most six words from the title", () => {
    expect(getThumbnailWords("  One two   three four five six seven eight ")).toEqual(
      ["One", "two", "three", "four", "five", "six"],
    );

    const thumbnail = renderThumbnail({ title: "One two three four five six seven", slug: "a" });
    expect(thumbnail.querySelectorAll(".blog-text-thumbnail__word")).toHaveLength(6);
    expect(thumbnail.querySelector(".blog-text-thumbnail__title")).toHaveTextContent(/^One two three four five six$/);
  });

  it("colours the whole last visual line and leaves the first line white", () => {
    mockWrapping([0, 0, 1, 1]);
    const thumbnail = renderThumbnail({ title: "Count the Tool Calls", slug: "agent-evals-tool-call-efficiency" });

    expect(accentText(thumbnail)).toBe("Tool Calls");
    const [first, second] = thumbnail.querySelectorAll(".blog-text-thumbnail__word");
    expect(first).not.toHaveClass("blog-text-thumbnail__accent");
    expect(second).not.toHaveClass("blog-text-thumbnail__accent");
  });

  it("follows the wrapping when the last line holds a different number of words", () => {
    mockWrapping([0, 0, 1, 1, 2, 2]);
    expect(accentText(renderThumbnail({ title: "Security Controls Should Not Depend on", slug: "s" }))).toBe("Depend on");

    vi.restoreAllMocks();
    mockWrapping([0, 0, 1, 1, 1, 2]);
    expect(accentText(renderThumbnail({ title: "robots.txt Is Becoming a Policy Interface", slug: "r" }))).toBe("Interface");
  });

  it("highlights only the last word of a single-line title and of the fallback", () => {
    expect(accentText(renderThumbnail({ title: "Retries", slug: "r" }))).toBe("Retries");
    expect(accentText(renderThumbnail({ title: "Short title", slug: "s" }))).toBe("title");

    const fallback = renderThumbnail({ title: "   ", slug: "empty" });
    expect(fallback.querySelector(".blog-text-thumbnail__title")).toHaveTextContent(/^From the journal$/);
    expect(accentText(fallback)).toBe("journal");
  });

  it("no longer uses per-post accent colour variants", () => {
    const thumbnail = renderThumbnail({ title: "Hello world", slug: "hello" });
    expect(thumbnail.className).not.toMatch(/--accent-/);
    expect(thumbnail).not.toHaveAttribute("data-accent");
  });

  it("is decorative and keeps the caller's class", () => {
    const thumbnail = renderThumbnail({ title: "Hello world", slug: "hello", className: "blog-story__visual" });
    expect(thumbnail).toHaveAttribute("aria-hidden", "true");
    expect(thumbnail).toHaveClass("blog-text-thumbnail", "blog-story__visual");
  });
});
