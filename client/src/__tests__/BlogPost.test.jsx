import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import BlogPost from "../Pages/Blog/BlogPost";

const setup = (path) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("BlogPost", () => {
  let originalClipboard;
  let originalExecCommand;

  beforeEach(() => {
    vi.restoreAllMocks();
    originalClipboard = navigator.clipboard;
    originalExecCommand = document.execCommand;
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
    Object.defineProperty(document, "execCommand", {
      value: vi.fn().mockReturnValue(true),
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      configurable: true,
    });
    Object.defineProperty(document, "execCommand", {
      value: originalExecCommand,
      configurable: true,
    });
  });

  it("renders markdown content and copies code", async () => {
    setup("/blog/shipping-a-production-ready-react-blog");

    expect(
      screen.getByRole("heading", {
        name: /shipping a production-ready react blog with markdown/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Why Markdown powers the DevKofi blog/i)).toBeInTheDocument();

    const copyButton = screen.getAllByRole("button", { name: /copy/i })[0];
    fireEvent.click(copyButton);

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    );
    expect(navigator.clipboard.writeText.mock.calls[0][0]).toContain(
      "useCopyToClipboard"
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument()
    );
  });

  it("shows fallback when post is missing", () => {
    setup("/blog/unknown");

    expect(screen.getByText(/Post not found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to all posts/i })).toBeInTheDocument();
  });
});
