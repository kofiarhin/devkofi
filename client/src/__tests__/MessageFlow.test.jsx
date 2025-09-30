import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import ChatBox from "../components/ChatBox.jsx";
import { renderWithProviders } from "../tests/utils/renderWithProviders.jsx";
import { chatMessageStore } from "../tests/msw/handlers.js";
import { server } from "../tests/msw/server.js";

describe("Message flow", () => {
  beforeEach(() => {
    chatMessageStore.data = [
      {
        id: "assistant-initial",
        role: "assistant",
        text: "Initial assistant message",
        createdAt: Date.now() - 2000,
        chatId: "flow",
      },
    ];
  });

  it("optimistically appends the user message", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("*/api/chats/:chatId/messages", async ({ request, params }) => {
        const body = await request.json().catch(() => ({}));
        await new Promise((resolve) => setTimeout(resolve, 50));
        const now = Date.now();

        return HttpResponse.json({
          user: {
            id: `server-user-${now}`,
            role: "user",
            text: body.text,
            createdAt: now,
            pendingId: body.tempId,
          },
          assistant: {
            id: `server-assistant-${now}`,
            role: "assistant",
            text: "Server reply",
            createdAt: now + 10,
          },
        });
      })
    );

    renderWithProviders(<ChatBox chatId="flow" />, { withRouter: false });

    const input = await screen.findByLabelText(/message composer/i);
    await user.type(input, "Hi there");

    const sendButton = screen.getByRole("button", { name: /send message/i });
    await user.click(sendButton);

    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(sendButton).toHaveTextContent(/sending/i);
  });

  it("appends the assistant message after a successful mutation", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatBox chatId="flow" />, { withRouter: false });

    const input = await screen.findByLabelText(/message composer/i);
    await user.type(input, "How are you?");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText(/echo: how are you\?/i)).toBeInTheDocument()
    );
  });

  it("autoscrolls to the latest message when already at the bottom", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatBox chatId="flow" />, { withRouter: false });

    const list = await screen.findByTestId("message-list");
    list.scrollTo = vi.fn();
    Object.defineProperty(list, "scrollHeight", { value: 300, configurable: true });
    Object.defineProperty(list, "clientHeight", { value: 300, configurable: true });

    const input = screen.getByLabelText(/message composer/i);
    await user.type(input, "Scroll please");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(list.scrollTo).toHaveBeenCalled());
  });

  it("reveals the jump-to-bottom button when scrolled up", async () => {
    renderWithProviders(<ChatBox chatId="flow" />, { withRouter: false });

    const list = await screen.findByTestId("message-list");
    Object.defineProperty(list, "scrollHeight", { value: 400, configurable: true });
    Object.defineProperty(list, "clientHeight", { value: 200, configurable: true });
    Object.defineProperty(list, "scrollTop", {
      configurable: true,
      get: () => 0,
      set: () => {},
    });

    await act(async () => {
      list.dispatchEvent(new Event("scroll"));
    });

    expect(
      await screen.findByRole("button", { name: /jump to latest/i })
    ).toBeInTheDocument();
  });
});
