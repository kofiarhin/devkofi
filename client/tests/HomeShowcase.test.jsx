import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../src/Pages/Home/Home";
import AiIntegration from "../src/Pages/AiIntegration/AiIntegration";
import Mentorship from "../src/Pages/Mentorship/Mentorship";
import Work from "../src/Pages/Work/Work";
import About from "../src/Pages/About/About";
import useProjects from "../src/hooks/useProjects";

vi.mock("../src/hooks/useProjects", () => ({ default: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const renderPage = (Page) => {
  vi.mocked(useProjects).mockReturnValue({ data: [], isLoading: false, isError: false, refetch: vi.fn() });
  return render(<MemoryRouter><Page /></MemoryRouter>);
};

const sectionByHeading = (name) => screen.getByRole("heading", { level: 2, name }).closest("section");

describe("Home", () => {
  it("leads with the positioning and the free intro call", () => {
    renderPage(Home);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("AI that works inside the systems you already run.");
    expect(screen.getAllByRole("link", { name: "Book a free intro call" })[0]).toHaveAttribute("href", "/book-a-call");
    expect(screen.getByRole("link", { name: "See the work" })).toHaveAttribute("href", "/work");
  });

  it("renders the hero portrait with the homepage size modifier and stable image attributes", () => {
    renderPage(Home);
    const portrait = screen.getByAltText("Kofi Arhin, AI engineer and founder of DevKofi");
    expect(portrait).toHaveAttribute("width", "880");
    expect(portrait).toHaveAttribute("height", "1100");
    expect(portrait.getAttribute("fetchpriority")).toBe("high");
    expect(portrait.closest("figure")).toHaveClass("site-portrait", "site-portrait--home");
  });

  it("follows the approved section order", () => {
    renderPage(Home);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(headings).toEqual([
      "See what an integration does.",
      "Built for businesses first. Mentorship for developers.",
      "Real systems, built and shipped.",
      "Three steps from first call to real progress.",
      "Software engineering discipline, applied to AI.",
      "Questions people ask first.",
      "Let's talk about what you want to build.",
    ]);
  });

  it("features AI integration first, then the two mentorship services", () => {
    renderPage(Home);
    const services = within(sectionByHeading("Built for businesses first. Mentorship for developers.")).getAllByRole("article");
    expect(services.map((card) => within(card).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "AI integration into existing systems",
      "AI engineering mentorship",
      "MERN stack mentorship",
    ]);
    expect(services[0]).toHaveClass("site-service--featured");
  });

  it("teases the three case studies with links into Work", () => {
    renderPage(Home);
    const teasers = within(sectionByHeading("Real systems, built and shipped.")).getAllByRole("article");
    expect(teasers.map((card) => within(card).getByRole("heading", { level: 3 }).textContent)).toEqual(["Hibachi", "Brain", "EscoWear"]);
    expect(within(teasers[2]).getByRole("link", { name: "Read the case study" })).toHaveAttribute("href", "/work#escowear");
  });

  it("runs the AI demo as a local simulation and lets visitors switch examples", () => {
    vi.useFakeTimers();
    renderPage(Home);
    const demo = sectionByHeading("See what an integration does.");
    expect(within(demo).getByText(/no real data and no ai calls/i)).toBeInTheDocument();
    expect(within(demo).getByRole("button", { name: "Support inbox" })).toHaveAttribute("aria-pressed", "true");

    act(() => within(demo).getByRole("button", { name: "Ask your docs" }).click());
    expect(within(demo).getByRole("button", { name: "Ask your docs" })).toHaveAttribute("aria-pressed", "true");

    act(() => vi.advanceTimersByTime(20000));
    expect(within(demo).getByText("Answer delivered with source links. Nothing in your systems was changed.", { selector: "span" }))
      .toBeInTheDocument();

    act(() => within(demo).getByRole("button", { name: "Pause demo animation" }).click());
    expect(within(demo).getByRole("button", { name: "Play demo animation" })).toBeInTheDocument();
  });
});

describe("public pages", () => {
  it.each([
    ["Home", Home],
    ["AI Integration", AiIntegration],
    ["Mentorship", Mentorship],
    ["Work", Work],
    ["About", About],
  ])("%s ends with a call to action for the free intro call and shows no prices", (_name, Page) => {
    const { container } = renderPage(Page);
    const sections = container.querySelectorAll("main > section");
    const lastSection = sections[sections.length - 1];
    expect(within(lastSection).getByRole("link", { name: "Book a free intro call" })).toHaveAttribute("href", "/book-a-call");
    expect(container.textContent).not.toMatch(/[£$€]\s?\d/);
    expect(container.textContent).not.toMatch(/stripe|per (month|hour|session)/i);
    // CALENDLY_INTRO_URL is null until Kofi creates a free intro event, so no Calendly link renders.
    expect(screen.queryByRole("link", { name: /calendly/i })).not.toBeInTheDocument();
    expect(container.querySelector('a[href*="calendly.com"]')).toBeNull();
  });

  it("puts AI engineering and MERN mentorship on one page without prices", () => {
    renderPage(Mentorship);
    expect(document.getElementById("ai-engineering")).toHaveTextContent("AI engineering mentorship");
    expect(document.getElementById("mern")).toHaveTextContent("MERN stack mentorship");
    expect(screen.getAllByText(/format and pricing are agreed on the free intro call/i).length).toBeGreaterThan(0);
  });
});
