import { renderHook } from "@testing-library/react";
import useLoginMutation from "../src/hooks/useLoginMutation";

describe("auth", () => {
  it("passing test", () => {});

  it("should login user successfully", async () => {
    const { result } = renderHook(() => useLoginMutation());
  });
});
