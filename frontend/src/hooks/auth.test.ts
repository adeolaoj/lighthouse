import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("successful login: signs in with Google and redirects to protected page", async () => {
    const { useAuth } = await import("./auth");
    const auth = useAuth();

    await expect(auth.login()).resolves.toEqual({ ok: true });

    expect(mockSignIn).toHaveBeenCalledWith("google");
    expect(mockPush).toHaveBeenCalledWith("/results");
  });

  it("cancelled login: returns user-safe message and stays in login flow", async () => {
    const oauthError = new Error("OAuth cancelled by user");
    mockSignIn.mockRejectedValueOnce(oauthError);

    const { useAuth } = await import("./auth");
    const auth = useAuth();
    const result = await auth.login();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Google sign-in was cancelled. Please try again.");
    }
    expect(mockPush).toHaveBeenCalledWith(
      "/login?error=Google%20sign-in%20was%20cancelled.%20Please%20try%20again."
    );
  });

  it("session persistence: token remains after refresh and is shared across tabs", async () => {
    const memoryStorage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      setItem: (key: string, value: string) => {
        memoryStorage.set(key, value);
      },
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      removeItem: (key: string) => {
        memoryStorage.delete(key);
      },
    });

    const { setAuthToken, getAuthToken, AUTH_TOKEN_KEY } = await import("../lib/auth");

    setAuthToken("test-session-token");

    const refreshRead = getAuthToken();
    const secondTabRead = localStorage.getItem(AUTH_TOKEN_KEY);

    expect(refreshRead).toBe("test-session-token");
    expect(secondTabRead).toBe("test-session-token");
  });
});
