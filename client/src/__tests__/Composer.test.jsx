import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ChatBox from "../components/ChatBox.jsx";
import { renderWithProviders } from "../tests/utils/renderWithProviders.jsx";
import { chatMessageStore } from "../tests/msw/handlers.js";

describe("Composer", () => {
  beforeEach(() => {
    chatMessageStore.data = [
      {
        id: "assistant-base",
        role: "assistant",
        text: "Ready to chat",
        createdAt: Date.now() - 3000,
        chatId: "composer",
      },
    ];
  });

  it("sends on Enter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatBox chatId="composer" />, { withRouter: false });

    const input = await screen.findByLabelText(/message composer/i);
    await user.type(input, "Ping");
    await user.keyboard("{Enter}");

    expect(await screen.findByText(/echo: ping/i)).toBeInTheDocument();
  });

  it("creates a newline with Shift+Enter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatBox chatId="composer" />, { withRouter: false });

    const input = await screen.findByLabelText(/message composer/i);
    await user.type(input, "Hello");
    await user.keyboard("{Shift>}{Enter}{/Shift}");

    expect(input.value).toContain("\n");
    expect(screen.getByRole("button", { name: /send message/i })).toHaveTextContent(/send/i);
  });

  it("disables sending when the input is empty", async () => {
    renderWithProviders(<ChatBox chatId="composer" />, { withRouter: false });

    const sendButton = await screen.findByRole("button", { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });
});
