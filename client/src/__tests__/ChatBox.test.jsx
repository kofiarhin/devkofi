import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { vi } from "vitest";
import ChatBox from "../components/ChatBox";

const mockMutate = vi.fn();

vi.mock("../hooks/useChatMutation", () => ({
  default: () => ({ mutate: mockMutate }),
}));

describe("ChatBox", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and send button", () => {
    render(<ChatBox />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("on submit, posts to /api/chat/ask and appends assistant message", async () => {
    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess({ answer: "Mock answer" });
    });

    render(<ChatBox />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Test question" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText("Test question")).toBeInTheDocument();
      expect(screen.getByText("Mock answer")).toBeInTheDocument();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { text: "Test question", history: [] },
      expect.any(Object)
    );
  });

  it("maintains last N messages in local state", async () => {
    mockMutate.mockImplementation(async (data, { onSuccess }) => {
      await new Promise((resolve) => process.nextTick(resolve));
      onSuccess({ answer: `Answer ${data.history.length / 2 + 1}` });
    });

    render(<ChatBox />);

    // Send first
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Q1" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(screen.getByText("Answer 1")).toBeInTheDocument()
    );

    // Send second
    fireEvent.change(input, { target: { value: "Q2" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(screen.getByText("Answer 2")).toBeInTheDocument()
    );

    // Check last call with history
    expect(mockMutate).toHaveBeenLastCalledWith(
      {
        text: "Q2",
        history: [
          { role: "user", content: "Q1" },
          { role: "assistant", content: "Answer 1" },
        ],
      },
      expect.any(Object)
    );
  });
});
