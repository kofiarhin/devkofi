import { screen } from "@testing-library/react";
import CourseOutline from "../Pages/CourseOutline/CourseOutline";
import courseData from "../Pages/CourseOutline/courseData.json";
import { renderWithProviders } from "../tests/utils/renderWithProviders";

describe("Course outline page", () => {
  it("lists course requirements and duration", () => {
    renderWithProviders(<CourseOutline />);

    expect(
      screen.getByText(`Duration: ${courseData.courseDuration}`)
    ).toBeInTheDocument();

    courseData.courseRequirements.forEach((requirement) => {
      expect(screen.getByText(requirement)).toBeInTheDocument();
    });
  });

  it("renders each module with its learning outcomes", () => {
    renderWithProviders(<CourseOutline />);

    courseData.modules.forEach((module) => {
      expect(
        screen.getByRole("heading", { name: module.module })
      ).toBeInTheDocument();
      module.content.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
      expect(screen.getByText(module.project)).toBeInTheDocument();
    });

    const cta = screen.getByRole("link", { name: /join mentorship program/i });
    expect(cta).toHaveAttribute("href", "/mentorship");
  });
});
