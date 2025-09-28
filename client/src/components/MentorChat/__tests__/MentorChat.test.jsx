import { vi } from "vitest";

var useMentorMock;

vi.mock("../../../hooks/useMentor.js", () => {
  useMentorMock = vi.fn();
  return {
    __esModule: true,
    default: useMentorMock,
  };
});

vi.mock("../../../constants/flags.js", () => ({
  ENABLE_MENTOR: true,
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MentorChat from "../MentorChat.jsx";

describe("MentorChat", () => {
  let writeTextMock;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue();
    Object.defineProperty(window.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete window.navigator.clipboard;
  });

  it("submits a question, renders mentor response, and tracks history", async () => {
    const mentorResponse = {
      title: "Async Title",
      explanation: "Helpful tip",
      code: "```js\nconsole.log('mentor');\n```",
      difficulty: "easy",
      confidence: 0.9,
    };
    const mutateAsync = vi.fn().mockResolvedValueOnce(mentorResponse);

    useMentorMock.mockReturnValue({ mutateAsync, isPending: false });

    render(<MentorChat />);

    const textarea = screen.getByLabelText(/ask the mentor/i);
    fireEvent.change(textarea, { target: { value: "How do I use the mentor?" } });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        question: "How do I use the mentor?",
        history: [
          {
            role: "user",
            content: "How do I use the mentor?",
          },
        ],
      });
    });

    expect(await screen.findByText("Async Title")).toBeInTheDocument();
    expect(screen.getByText("Helpful tip")).toBeInTheDocument();
    expect(screen.getByText(/console\.log\('mentor'\)/)).toBeInTheDocument();
    expect(screen.getAllByTestId("chat-message")).toHaveLength(2);
  });

  it("copies mentor code to clipboard", async () => {
    const mentorResponse = {
      title: "Copy Title",
      explanation: "Copy it",
      code: "```js\nconst a = 1;\n```",
      difficulty: "easy",
      confidence: 0.8,
    };

    useMentorMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValueOnce(mentorResponse),
      isPending: false,
    });

    render(<MentorChat />);

    fireEvent.change(screen.getByLabelText(/ask the mentor/i), {
      target: { value: "Copy code" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    const copyButton = await screen.findByRole("button", { name: /copy code/i });
    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith("const a = 1;\n");
  });

  it("copies unfenced code without adding a trailing newline", async () => {
    const mentorResponse = {
      title: "Plain Code",
      explanation: "Just text",
      code: "console.log('plain');",
      difficulty: "easy",
      confidence: 0.6,
    };

    useMentorMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValueOnce(mentorResponse),
      isPending: false,
    });

    render(<MentorChat />);

    fireEvent.change(screen.getByLabelText(/ask the mentor/i), {
      target: { value: "Copy plain" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    const copyButton = await screen.findByRole("button", { name: /copy code/i });
    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith("console.log('plain');");
  });

  it("disables submit button while pending", () => {
    useMentorMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: true });

    render(<MentorChat />);

    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("returns null when the mentor feature is disabled", () => {
    useMentorMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    const { container } = render(<MentorChat isEnabled={false} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders an error response when the mentor request fails", async () => {
    const mutateAsync = vi.fn().mockRejectedValueOnce(new Error("mentor offline"));
    useMentorMock.mockReturnValue({ mutateAsync, isPending: false });

    render(<MentorChat />);

    fireEvent.change(screen.getByLabelText(/ask the mentor/i), {
      target: { value: "Trigger error" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(await screen.findByText("Request Failed")).toBeInTheDocument();
    expect(screen.getByText("mentor offline")).toBeInTheDocument();
  });

  it("ignores submissions that only contain whitespace", async () => {
    const mutateAsync = vi.fn();
    useMentorMock.mockReturnValue({ mutateAsync, isPending: false });

    render(<MentorChat />);

    fireEvent.change(screen.getByLabelText(/ask the mentor/i), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(mutateAsync).not.toHaveBeenCalled();
    expect(screen.queryAllByTestId("chat-message")).toHaveLength(0);
  });

  it("does not attempt to copy when the clipboard API is unavailable", async () => {
    useMentorMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValueOnce({
        title: "No Clipboard",
        explanation: "Cannot copy",
        code: "```js\nconsole.log('test');\n```",
        difficulty: "easy",
        confidence: 0.5,
      }),
      isPending: false,
    });

    delete window.navigator.clipboard;

    render(<MentorChat />);

    fireEvent.change(screen.getByLabelText(/ask the mentor/i), {
      target: { value: "Copy?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    const copyButton = await screen.findByRole("button", { name: /copy code/i });
    fireEvent.click(copyButton);

    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it("does not render a code block when the mentor returns a non-string code field", async () => {
    useMentorMock.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValueOnce({
        title: "No Code",
        explanation: "Nothing to run",
        code: 123,
        difficulty: "medium",
        confidence: 0.4,
      }),
      isPending: false,
    });

    render(<MentorChat />);

    fireEvent.change(screen.getByLabelText(/ask the mentor/i), {
      target: { value: "Where is the code?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(await screen.findByText("No Code")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /copy code/i })).toBeNull();
  });
});
