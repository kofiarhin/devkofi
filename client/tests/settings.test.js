import { describe, it, expect } from "vitest";
import fs from "fs";

describe("settings page wiring", () => {
  it("registers private settings route and nav entries", () => {
    const appContent = fs.readFileSync("src/App.jsx", "utf-8");
    const headerContent = fs.readFileSync("src/components/Header/Header.jsx", "utf-8");
    const sideNavContent = fs.readFileSync("src/components/SideNav/SideNav.jsx", "utf-8");

    expect(appContent.includes('path="/settings"')).toBe(true);
    expect(headerContent.includes('to="/settings"')).toBe(true);
    expect(sideNavContent.includes('to="/settings"')).toBe(true);
  });

  it("settings page supports dirty state, validation, and summaries", () => {
    const settingsContent = fs.readFileSync("src/Pages/Settings/Settings.jsx", "utf-8");

    expect(settingsContent.includes("beforeunload")).toBe(true);
    expect(settingsContent.includes("You have unsaved changes. Leave without saving?")).toBe(true);
    expect(settingsContent.includes("validationErrors")).toBe(true);
    expect(settingsContent.includes("changedPayload")).toBe(true);
    expect(settingsContent.includes("Profile completeness")).toBe(true);
    expect(settingsContent.includes("Plan & support summary")).toBe(true);
  });

  it("settings hooks target profile endpoints and cache invalidation", () => {
    const profileHook = fs.readFileSync("src/hooks/useProfileMeQuery.js", "utf-8");
    const updateHook = fs.readFileSync("src/hooks/useUpdateProfileMutation.js", "utf-8");

    expect(profileHook.includes('/api/profile/me')).toBe(true);
    expect(profileHook.includes('["profile-me"]')).toBe(true);

    expect(updateHook.includes('/api/profile/me')).toBe(true);
    expect(updateHook.includes('["onboarding-status"]')).toBe(true);
    expect(updateHook.includes('["student-dashboard-summary"]')).toBe(true);
    expect(updateHook.includes('["admin-users"]')).toBe(true);
  });
});
