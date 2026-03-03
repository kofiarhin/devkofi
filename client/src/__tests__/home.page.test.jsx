import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Home from "../Pages/Home/Home";
import { renderWithProviders } from "../tests/utils/renderWithProviders";
import { pricingData } from "../components/Pricing/pricingData";

describe("Home page", () => {
  it("renders the AI-powered hero with both calls to action", () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("link", { name: /view course outline/i })
    ).toHaveAttribute("href", "/#course-outline");
    expect(screen.getByRole("link", { name: /enroll now/i })).toHaveAttribute(
      "href",
      "/register"
    );
    expect(screen.getByAltText(/devkofi mentor/i)).toBeInTheDocument();
  });

  it("shows the AI engineering process and curriculum outcome", () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("heading", { name: /the ai engineering process/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /6-month ai-powered mern engineering program/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/students deploy a production-grade ai-augmented mern/i)
    ).toBeInTheDocument();
  });

  it("displays every pricing tier", () => {
    renderWithProviders(<Home />);

    for (const plan of pricingData) {
      expect(
        screen.getByRole("heading", { name: plan.title })
      ).toBeInTheDocument();
    }
  });
});
