import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import fs from "node:fs";
import { renderApp } from "../test/renderApp";

vi.mock("../src/hooks/queries/useAdminSession", () => ({ default: () => ({}) }));
vi.mock("../src/hooks/mutations/useLogoutAdmin", () => ({
  default: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe("retired mentorship flow", () => {
  it("keeps the legacy pricing component directing enquiries to contact", () => {
    const content = fs.readFileSync("src/components/Pricing/Pricing.jsx", "utf-8");
    expect(content).toContain("Choose the support level that matches the build");
    expect(content).toContain('plan?.cta?.route || "/contact"');
  });

  it.each(["/join/standard", "/onboarding?plan=standard", "/dashboard"])(
    "returns not found for the retired student route %s",
    (route) => {
      renderApp(route);
      expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
      expect(screen.queryByRole("link", { name: /join|onboarding|student dashboard/i })).not.toBeInTheDocument();
    },
  );
});
