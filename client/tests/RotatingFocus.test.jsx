import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { RotatingFocus } from "../src/components/Studio/Studio";

const phrases = ["AI agents", "internal tools", "AI-powered products"];

const mockReducedMotion = (matches) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  delete window.matchMedia;
});

const activePhrase = (container) =>
  container.querySelector(".studio-hero-focus__phrase.is-active")?.textContent;

describe("RotatingFocus", () => {
  it("cycles through each phrase and exposes the full list to assistive tech", () => {
    vi.useFakeTimers();
    mockReducedMotion(false);
    const { container } = render(<RotatingFocus lead="Building" phrases={phrases} interval={1000} />);

    expect(screen.getByText("Building AI agents, internal tools, and AI-powered products")).toBeInTheDocument();
    expect(activePhrase(container)).toBe("AI agents");

    act(() => vi.advanceTimersByTime(1000));
    expect(activePhrase(container)).toBe("internal tools");

    act(() => vi.advanceTimersByTime(1000));
    expect(activePhrase(container)).toBe("AI-powered products");

    act(() => vi.advanceTimersByTime(1000));
    expect(activePhrase(container)).toBe("AI agents");
  });

  it("renders a stable, non-rotating version when reduced motion is preferred", () => {
    vi.useFakeTimers();
    mockReducedMotion(true);
    const { container } = render(<RotatingFocus lead="Building" phrases={phrases} interval={1000} />);

    expect(container.querySelector(".studio-hero-focus__rotator")).toBeNull();
    expect(container.textContent).toBe("Building AI agents, internal tools, and AI-powered products");

    act(() => vi.advanceTimersByTime(5000));
    expect(container.textContent).toBe("Building AI agents, internal tools, and AI-powered products");
  });
});
