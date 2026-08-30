import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../src/Pages/Home/Home";
import useProjects from "../src/hooks/useProjects";

vi.mock("../src/hooks/useProjects", () => ({ default: vi.fn() }));
afterEach(cleanup);

const renderHome = (state = {}) => {
  vi.mocked(useProjects).mockReturnValue({ data: [], isLoading: false, isError: false, ...state });
  return render(<MemoryRouter><Home /></MemoryRouter>);
};

describe("Home showcase", () => {
  it("shows three selected projects and links to Systems without a second gallery", () => {
    renderHome();
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => within(card).getByRole("heading", { level: 3 }).textContent))
      .toEqual(["Hibachi", "Brain", "ThriftChef"]);
    expect(screen.getByRole("link", { name: "Explore Engineering Systems" }))
      .toHaveAttribute("href", "/engineering-systems");
  });

  it.each([
    [{ isLoading: true }, "Loading selected work..."],
    [{ isError: true }, "Selected work is temporarily unavailable."],
  ])("preserves the selected-work state and Systems link: %j", (state, message) => {
    renderHome(state);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("link", { name: "Explore Engineering Systems" })).toBeInTheDocument();
  });
});
