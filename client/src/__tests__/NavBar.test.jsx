import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";

const renderWithRouter = (initialPath = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/*" element={<NavBar />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("NavBar", () => {
  it("highlights the active route", () => {
    renderWithRouter("/blog");

    const blogLink = screen.getByRole("link", { name: /blog/i });
    expect(blogLink).toHaveAttribute("aria-current", "page");
  });

  it("toggles the mobile menu and closes on outside click", async () => {
    renderWithRouter("/");

    const toggle = screen.getByRole("button", { name: /menu/i });
    const panel = screen.getByRole("navigation").querySelector("#mobile-menu");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveAttribute("aria-hidden", "false");

    fireEvent.mouseDown(document.body);

    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
    expect(panel).toHaveAttribute("aria-hidden", "true");
  });

  it("closes the menu when navigating to another route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <NavBar />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/blog" element={<div>Blog</div>} />
        </Routes>
      </MemoryRouter>
    );

    const toggle = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(toggle);

    const blogLink = screen.getAllByRole("link", { name: /blog/i }).find((link) => link.closest("#mobile-menu"));
    fireEvent.click(blogLink);

    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
  });
});
