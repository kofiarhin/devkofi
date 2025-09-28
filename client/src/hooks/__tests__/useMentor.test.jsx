import React from "react";
import { renderHook, act } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import useMentor from "../useMentor.js";
import { createTestQueryClient } from "../../tests/utils/queryClient";
import { SERVER_BASE_URL } from "../../constants/baseUrl.js";

const setup = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

describe("useMentor", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the question payload and returns parsed mentor response", async () => {
    const { wrapper, queryClient } = setup();
    const mentorResponse = {
      title: "Sample",
      explanation: "Details",
      code: "```js\nconsole.log('x');\n```",
      difficulty: "easy",
      confidence: 0.8,
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mentorResponse,
    });

    const { result } = renderHook(() => useMentor(), { wrapper });

    let data;
    await act(async () => {
      data = await result.current.mutateAsync({
        question: "How?",
        history: [{ role: "user", content: "Prev" }],
      });
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${SERVER_BASE_URL}/api/mentor/ask`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: "How?",
          history: [{ role: "user", content: "Prev" }],
        }),
      }
    );
    expect(data).toEqual(mentorResponse);

    queryClient.clear();
  });

  it("throws when server responds with non-200 status", async () => {
    const { wrapper, queryClient } = setup();

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Server error" }),
    });

    const { result } = renderHook(() => useMentor(), { wrapper });

    await expect(
      result.current.mutateAsync({ question: "fail" })
    ).rejects.toThrow(/server error/i);

    queryClient.clear();
  });

  it("throws when response JSON cannot be parsed", async () => {
    const { wrapper, queryClient } = setup();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const { result } = renderHook(() => useMentor(), { wrapper });

    await expect(
      result.current.mutateAsync({ question: "bad" })
    ).rejects.toThrow(/invalid json/i);

    queryClient.clear();
  });
});
