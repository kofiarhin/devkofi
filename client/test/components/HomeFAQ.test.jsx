import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomeFAQ from "../../src/components/HomeFAQ/HomeFAQ";
import { HOME_FAQ_ITEMS } from "../../src/components/HomeFAQ/home-faq.constants";

describe("HomeFAQ", () => {
  it("renders the section heading and all questions", () => {
    render(<HomeFAQ />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /questions before you build with ai/i,
      }),
    ).toBeInTheDocument();

    HOME_FAQ_ITEMS.forEach((item) => {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    });
  });

  it("opens the first answer by default", () => {
    render(<HomeFAQ />);

    const firstButton = screen.getByRole("button", {
      name: HOME_FAQ_ITEMS[0].question,
    });

    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(HOME_FAQ_ITEMS[0].answer)).toBeVisible();
  });

  it("opens a closed question when clicked", async () => {
    const user = userEvent.setup();
    render(<HomeFAQ />);

    const secondButton = screen.getByRole("button", {
      name: HOME_FAQ_ITEMS[1].question,
    });

    expect(secondButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(HOME_FAQ_ITEMS[1].answer)).not.toBeVisible();

    await user.click(secondButton);

    expect(secondButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(HOME_FAQ_ITEMS[1].answer)).toBeVisible();
  });

  it("closes an open question when clicked", async () => {
    const user = userEvent.setup();
    render(<HomeFAQ />);

    const firstButton = screen.getByRole("button", {
      name: HOME_FAQ_ITEMS[0].question,
    });

    await user.click(firstButton);

    expect(firstButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(HOME_FAQ_ITEMS[0].answer)).not.toBeVisible();
  });

  it("allows multiple answers to remain open", async () => {
    const user = userEvent.setup();
    render(<HomeFAQ />);

    const firstButton = screen.getByRole("button", {
      name: HOME_FAQ_ITEMS[0].question,
    });
    const secondButton = screen.getByRole("button", {
      name: HOME_FAQ_ITEMS[1].question,
    });

    await user.click(secondButton);

    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect(secondButton).toHaveAttribute("aria-expanded", "true");
  });
});
