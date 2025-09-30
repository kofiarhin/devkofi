import React from "react";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ChatBox from "../components/ChatBox.jsx";
import { renderWithProviders } from "../tests/utils/renderWithProviders.jsx";
import { chatMessageStore } from "../tests/msw/handlers.js";

describe("ChatBox", () => {
  beforeEach(() => {
    chatMessageStore.data = [
      {
        id: "assistant-1",
        role: "assistant",
        text: "Welcome to the chat",
        createdAt: Date.now() - 2000,
        chatId: "demo",
      },
    ];
  });

  it("renders initial server messages", async () => {
    renderWithProviders(<ChatBox chatId="demo" chips={["Hello"]} />, {
      withRouter: false,
    });

    expect(await screen.findByText(/welcome to the chat/i)).toBeInTheDocument();
  });

  it("applies dark theme tokens", async () => {
    renderWithProviders(<ChatBox chatId="demo" />, { withRouter: false });

    const container = await screen.findByTestId("chat-box");
    expect(container.style.getPropertyValue("--bg")).toBe("#0B0B0C");
    expect(container.style.getPropertyValue("--text")).toBe("#F4F5F7");
  });
});
