import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import { http, HttpResponse } from "msw";
import useGithubInfoQuery from "../hooks/useGithubInfoQuery";
import useMentorshipMutation from "../hooks/useMentorshipMutation";
import usecontactMutation from "../hooks/useContactMutation";
import useJoinNewsletterMutation from "../hooks/useJoinNewsletterMutation";
import useTemplateQuery from "../hooks/useTemplateQuery";
import useUsersQuery from "../hooks/useUsersQuery";
import useAdminData from "../hooks/useAdminData";
import useStudentData from "../hooks/useStudentData";
import { createTestQueryClient } from "../tests/utils/queryClient";
import { server } from "../tests/msw/server";

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

describe("API hooks", () => {
  it("fetches GitHub stats successfully", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useGithubInfoQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.totalContributions).toBe(120);
    expect(result.current.data.repositories).toHaveLength(2);
  });

  it("handles mentorship enrolment success and failure", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useMentorshipMutation(), { wrapper });

    let successResponse;
    await act(async () => {
      successResponse = await result.current.mutateAsync({
        fullName: "Hook Tester",
        email: "hook@test.dev",
        phone: "1234567890",
        packageName: "Full-Stack Bootcamp: Standard",
      });
    });
    expect(successResponse.success).toBe(true);

    server.use(
      http.post("*/api/mentorship", () =>
        HttpResponse.json(
          { error: "Package unavailable" },
          { status: 400 }
        )
      )
    );

    let errorResponse;
    await act(async () => {
      errorResponse = await result.current.mutateAsync({
        fullName: "Hook Tester",
        email: "hook@test.dev",
        phone: "1234567890",
        packageName: "Sold Out",
      });
    });
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toMatch(/package unavailable/i);
  });

  it("resolves and rejects contact mutation results", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usecontactMutation(), { wrapper });

    let contactResponse;
    await act(async () => {
      contactResponse = await result.current.mutateAsync({
        fullName: "Hook Contact",
        email: "contact@test.dev",
        message: "Hello there",
      });
    });
    expect(contactResponse).toMatchObject({ success: true });

    server.use(
      http.post("*/api/contact", () =>
        HttpResponse.json({ error: "Server offline" }, { status: 500 })
      )
    );

    await expect(
      result.current.mutateAsync({
        fullName: "Hook Contact",
        email: "contact@test.dev",
        message: "Hello there",
      })
    ).rejects.toThrow(/server offline/i);
  });

  it("reports newsletter validation feedback", async () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useJoinNewsletterMutation(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.mutateAsync({ email: "invalid-email" });
    });
    expect(response.error).toMatch(/invalid email/i);
  });

  it("retrieves templates, admin, student and user data", async () => {
    const { wrapper } = createWrapper();

    const templateHook = renderHook(() => useTemplateQuery(), { wrapper });
    await waitFor(() =>
      expect(templateHook.result.current.isSuccess).toBe(true)
    );
    expect(templateHook.result.current.data.templates).toHaveLength(2);

    const adminHook = renderHook(() => useAdminData("token"), { wrapper });
    await waitFor(() => expect(adminHook.result.current.isSuccess).toBe(true));
    expect(adminHook.result.current.data.usersCount).toBe(12);

    const studentHook = renderHook(() => useStudentData(), { wrapper });
    await waitFor(() =>
      expect(studentHook.result.current.isSuccess).toBe(true)
    );
    expect(studentHook.result.current.data.count).toBe(2);

    const usersHook = renderHook(() => useUsersQuery("token"), { wrapper });
    await waitFor(() => expect(usersHook.result.current.isSuccess).toBe(true));
    expect(usersHook.result.current.data.users).toHaveLength(2);
  });
});
