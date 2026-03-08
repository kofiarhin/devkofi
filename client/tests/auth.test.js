import { describe, it, expect } from "vitest";
import fs from "fs";

describe("frontend mentorship flow wiring", () => {
  it("pricing component includes mentorship plan heading", () => {
    const content = fs.readFileSync("src/components/Pricing/Pricing.jsx", "utf-8");
    expect(content.includes("Mentorship Plans")).toBe(true);
    expect(content.includes("/join/standard") || content.includes("cta")).toBe(true);
  });

  it("join page checks onboarding status and routes to onboarding", () => {
    const content = fs.readFileSync("src/Pages/Join/Join.jsx", "utf-8");
    expect(content.includes("onboardingCompleted")).toBe(true);
    expect(content.includes("/onboarding?plan=")).toBe(true);
  });

  it("onboarding page submits intake and continues to join flow", () => {
    const content = fs.readFileSync("src/Pages/Onboarding/Onboarding.jsx", "utf-8");
    expect(content.includes("useOnboardingIntakeMutation")).toBe(true);
    expect(content.includes("navigate(`/join/${plan}`")).toBe(true);
  });

  it("student dashboard renders mentorship-aware state", () => {
    const content = fs.readFileSync("src/Pages/Dashboard/StudentDashboard/StudentDashboard.jsx", "utf-8");
    expect(content.includes("AI Workflow Readiness")).toBe(true);
    expect(content.includes("Next Action")).toBe(true);
  });
});
