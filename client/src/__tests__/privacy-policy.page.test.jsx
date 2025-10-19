import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyPolicy from "../Pages/PrivacyPolicy";

describe("PrivacyPolicy Page", () => {
  it("renders heading and effective date", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Effective Date:/i)).toBeInTheDocument();
  });

  it("contains contact email link", () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    const mailLink = screen.getByRole("link", { name: /devkofi@gmail.com/i });
    expect(mailLink).toHaveAttribute("href", "mailto:devkofi@gmail.com");
  });
});
