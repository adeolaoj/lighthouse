import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

const mockSignIn = vi.fn<() => Promise<void>>();
const mockSignOut = vi.fn<() => Promise<void>>();
const mockPush = vi.fn<(path: string) => void>();
const mockGetRedirectParam = vi.fn<(key: string) => string | null>();

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signIn: mockSignIn, signOut: mockSignOut }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGetRedirectParam }),
}));

describe("OAuth login flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn.mockResolvedValue(undefined);
    mockSignOut.mockResolvedValue(undefined);
    mockGetRedirectParam.mockImplementation((key) => (key === "redirect" ? "/results" : null));
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("successful login: signs in with Google and redirects to protected page", async () => {
    const { useAuth } = await import("./auth");
    const { result } = renderHook(() => useAuth());

    let loginResult: Awaited<ReturnType<typeof result.current.login>> | undefined;
    await act(async () => {
      loginResult = await result.current.login();
    });

    expect(loginResult).toEqual({ ok: true });
    expect(mockSignIn).toHaveBeenCalledWith("google");
    expect(mockPush).toHaveBeenCalledWith("/results");
    expect(mockGetRedirectParam).toHaveBeenCalledWith("redirect");
  });

  it("cancelled login: returns user-safe message and stays in login flow", async () => {
    const oauthError = new Error("OAuth cancelled by user");
    mockSignIn.mockRejectedValueOnce(oauthError);

    const { useAuth } = await import("./auth");
    const { result: hook } = renderHook(() => useAuth());

    let loginResult: Awaited<ReturnType<typeof hook.current.login>> | undefined;
    await act(async () => {
      loginResult = await hook.current.login();
    });

    expect(loginResult).toBeDefined();
    expect(loginResult).toMatchObject({
      ok: false,
      message: "Google sign-in was cancelled. Please try again.",
    });

    const pushedPath = mockPush.mock.calls[0][0] as string;
    const pushedUrl = new URL(pushedPath, "http://localhost");
    expect(pushedUrl.pathname).toBe("/login");
    expect(pushedUrl.searchParams.get("error")).toBe(
      "Google sign-in was cancelled. Please try again."
    );
    expect(mockGetRedirectParam).toHaveBeenCalledWith("redirect");
  });
});
