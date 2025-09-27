import { screen } from "@testing-library/react";
import Home from "../Pages/Home/Home";
import { renderWithProviders } from "../tests/utils/renderWithProviders";
import { pricingData } from "../components/Pricing/pricingData";

describe("Home page", () => {
  it("renders landing hero copy from the data source", () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("link", { name: /get started!/i })
    ).toBeInTheDocument();
    expect(screen.getByAltText(/profile/i)).toBeInTheDocument();
  });

  it("displays every pricing tier with its call to action", () => {
    renderWithProviders(<Home />);

    for (const plan of pricingData) {
      expect(screen.getByRole("heading", { name: plan.title })).toBeInTheDocument();
    }

    expect(
      screen.getByRole("heading", {
        name: /get free developer tips & tools every week/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeEnabled();
  });

  it("encourages visitors to join the mentorship program", () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("heading", { name: /write, test, deploy/i })
    ).toBeInTheDocument();

    const joinLinks = screen.getAllByRole("link", { name: /join/i });
    expect(joinLinks.length).toBeGreaterThan(0);
    expect(joinLinks[0]).toHaveAttribute("href", "/register");
  });
});
