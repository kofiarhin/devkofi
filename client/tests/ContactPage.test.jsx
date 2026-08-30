import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Contact from "../src/Pages/Contact/Contact";

const { mutate, reset } = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
}));

vi.mock("../src/hooks/useContactMutation", () => ({
  default: () => ({
    mutate,
    reset,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  }),
}));

describe("Contact page", () => {
  it("links to Kofi's verified professional social profiles", () => {
    render(<Contact />);

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/kofiarhin",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/joshua-o-9b49b72b/",
    );
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute(
      "href",
      "https://x.com/kwofiArhin",
    );
    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute(
      "href",
      "https://www.youtube.com/@devkofi",
    );
  });
});
