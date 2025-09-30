import React from "react";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import ChatBox from "../components/ChatBox.jsx";
import { renderWithProviders } from "../tests/utils/renderWithProviders.jsx";
import { chatMessageStore } from "../tests/msw/handlers.js";
import { server } from "../tests/msw/server.js";

describe("Self-healing normalisation", () => {
  beforeEach(() => {
    chatMessageStore.data = [];
  });

  it("repairs malformed payloads, de-dupes, and sorts chronologically", async () => {
    const baseTime = Date.now();

    server.use(
      http.get("*/api/chats/:chatId/messages", () =>
        HttpResponse.json({
          messages: [
            {
              role: "assistant",
              text: "First duplicate",
              id: "dup",
              createdAt: baseTime - 50,
            },
            {
              role: "assistant",
              text: "Second duplicate",
              id: "dup",
              createdAt: baseTime,
            },
            {
              role: "user",
              text: "User text",
              createdAt: baseTime - 200,
            },
            {
              role: "mentor",
              text: null,
              id: null,
              createdAt: baseTime - 100,
            },
          ],
        })
      )
    );

    renderWithProviders(<ChatBox chatId="repair" />, { withRouter: false });

    const articles = await screen.findAllByRole("article");
    const texts = articles.map((article) => article.textContent);

    expect(articles).toHaveLength(3);
    expect(texts).toEqual([
      "User text",
      "Message unavailable",
      "Second duplicate",
    ]);
  });
});
