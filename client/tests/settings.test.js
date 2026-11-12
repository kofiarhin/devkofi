import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderApp } from "../test/renderApp";

vi.mock("../src/hooks/queries/useAdminSession", () => ({ default: () => ({}) }));
vi.mock("../src/hooks/mutations/useLogoutAdmin", () => ({
  default: () => ({ mutate: vi.fn(), isPending: false }),
}));

const ADMIN = { email: "admin@devkofi.com", role: "admin" };

describe("retired student settings", () => {
  it.each([null, ADMIN])("does not expose a settings page with admin state %j", (admin) => {
    renderApp("/settings", { admin });
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("keeps desktop and mobile navigation on current public and admin destinations", () => {
    renderApp("/settings", { admin: ADMIN, isOpen: true });
    for (const name of ["Primary navigation", "Mobile navigation"]) {
      const nav = within(screen.getByRole("navigation", { name }));
      expect(nav.queryByRole("link", { name: /settings/i })).not.toBeInTheDocument();
      expect(nav.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/admin/dashboard");
      expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
      expect(nav.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    }
  });
});
