import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import store from "../src/redux/store";
import Projects from "../src/Pages/Projects/Projects";

const { mockUseProjects } = vi.hoisted(() => ({
  mockUseProjects: vi.fn(),
}));

vi.mock("../src/hooks/useProjects", () => ({
  default: mockUseProjects,
}));

const renderProjects = () =>
  render(
    <Provider store={store}>
      <Projects />
    </Provider>,
  );

describe("Projects page", () => {
  beforeEach(() => {
    mockUseProjects.mockReset();
  });

  it("renders project records returned by the query", () => {
    mockUseProjects.mockReturnValue({
      data: [
        {
          id: 25,
          name: "KareBraids",
          description: "Hair braiding brand platform.",
          features: ["Service catalogue"],
          status: "Building",
          thumbnailUrl: "https://example.com/karebraids.png",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderProjects();

    expect(screen.getAllByText("KareBraids").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Total").parentElement.querySelector("dd"),
    ).toHaveTextContent("1");
  });

  it("shows the request error and retries the query", async () => {
    const refetch = vi.fn();
    mockUseProjects.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Projects are temporarily unavailable"),
      refetch,
    });

    renderProjects();

    expect(
      screen.getByText("Projects are temporarily unavailable"),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
