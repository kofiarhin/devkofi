import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Blog from "../../src/Pages/Blog/Blog";
import BlogArticle from "../../src/Pages/BlogArticle/BlogArticle";
import useBlogPosts from "../../src/hooks/queries/useBlogPosts";
import useBlogPost from "../../src/hooks/queries/useBlogPost";

vi.mock("../../src/hooks/queries/useBlogPosts", () => ({ default: vi.fn() }));
vi.mock("../../src/hooks/queries/useBlogPost", () => ({ default: vi.fn() }));

const post = {
  title: "Reliable agent retries need contracts",
  slug: "reliable-agent-retries-need-contracts",
  excerpt: "Retries need deterministic boundaries.",
  content: "# Reliable retries\n\nA retry is another state transition.",
  tags: ["AI Engineering", "Reliability"],
  sources: [{ title: "Primary source", url: "https://example.com/source" }],
  publishedAt: "2026-09-01T12:00:00.000Z",
  coverImageUrl: "https://res.cloudinary.com/test/image/upload/blog-thumbnail.png",
  coverImageAlt: "A technical systems thumbnail.",
};

const defaultPagination = {
  page: 1,
  limit: 10,
  totalPosts: 1,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

describe("Blog pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBlogPosts.mockReturnValue({
      data: { posts: [], pagination: { ...defaultPagination, totalPosts: 0 } },
      isLoading: false,
      isError: false,
    });
    useBlogPost.mockReturnValue({ data: { post }, isLoading: false, isError: false });
  });

  it("renders published article cards linking to their slug", () => {
    useBlogPosts.mockReturnValue({
      data: { posts: [post], pagination: defaultPagination },
      isLoading: false,
      isError: false,
    });

    render(<MemoryRouter><Blog /></MemoryRouter>);

    expect(useBlogPosts).toHaveBeenCalledWith(1, 10);
    expect(screen.getByRole("heading", { name: post.title })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: post.coverImageAlt })).toHaveAttribute(
      "src",
      post.coverImageUrl,
    );
    expect(screen.getByRole("link", { name: /read article/i })).toHaveAttribute(
      "href",
      `/blog/${post.slug}`,
    );
    expect(screen.queryByRole("navigation", { name: /blog pagination/i })).not.toBeInTheDocument();
  });

  it("reads the requested page from the URL and renders previous and next links", () => {
    useBlogPosts.mockReturnValue({
      data: {
        posts: [post],
        pagination: {
          page: 2,
          limit: 10,
          totalPosts: 25,
          totalPages: 3,
          hasPreviousPage: true,
          hasNextPage: true,
        },
      },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={["/blog?page=2"]}>
        <Blog />
      </MemoryRouter>,
    );

    expect(useBlogPosts).toHaveBeenCalledWith(2, 10);
    expect(screen.getByRole("navigation", { name: /blog pagination/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("href", "/blog");
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/blog?page=3");
  });

  it("renders an honest empty state", () => {
    render(<MemoryRouter><Blog /></MemoryRouter>);

    expect(screen.getByText(/no articles have been published yet/i)).toBeInTheDocument();
  });

  it("renders loading and error states", () => {
    useBlogPosts.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { unmount } = render(<MemoryRouter><Blog /></MemoryRouter>);
    expect(screen.getByText(/loading articles/i)).toBeInTheDocument();

    unmount();
    useBlogPosts.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(<MemoryRouter><Blog /></MemoryRouter>);
    expect(screen.getByRole("alert")).toHaveTextContent(/could not load articles/i);
  });

  it("renders Markdown, thumbnail, and source links for one article", () => {
    render(<MemoryRouter><BlogArticle slug={post.slug} /></MemoryRouter>);

    expect(screen.getByRole("img", { name: post.coverImageAlt })).toHaveAttribute(
      "src",
      post.coverImageUrl,
    );
    expect(screen.getByRole("heading", { name: "Reliable retries" })).toBeInTheDocument();
    expect(screen.getByText("A retry is another state transition.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Primary source" })).toHaveAttribute(
      "href",
      "https://example.com/source",
    );
  });

  it("does not execute or render raw HTML from article Markdown", () => {
    useBlogPost.mockReturnValue({
      data: { post: { ...post, content: "Safe copy\n\n<script>alert('unsafe')</script>" } },
      isLoading: false,
      isError: false,
    });

    const { container } = render(<MemoryRouter><BlogArticle slug={post.slug} /></MemoryRouter>);

    expect(screen.getByText("Safe copy")).toBeInTheDocument();
    expect(container.querySelector("script")).not.toBeInTheDocument();
  });

  it("omits the thumbnail safely for older posts without one", () => {
    useBlogPosts.mockReturnValue({
      data: {
        posts: [{ ...post, coverImageUrl: null, coverImageAlt: null }],
        pagination: defaultPagination,
      },
      isLoading: false,
      isError: false,
    });

    render(<MemoryRouter><Blog /></MemoryRouter>);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: post.title })).toBeInTheDocument();
  });

  it("renders article loading and not-found states", () => {
    useBlogPost.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { unmount } = render(<MemoryRouter><BlogArticle slug={post.slug} /></MemoryRouter>);
    expect(screen.getByText(/loading article/i)).toBeInTheDocument();

    unmount();
    useBlogPost.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(<MemoryRouter><BlogArticle slug={post.slug} /></MemoryRouter>);
    expect(screen.getByRole("alert")).toHaveTextContent(/article could not be found/i);
  });
});
