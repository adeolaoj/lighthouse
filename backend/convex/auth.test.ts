import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SESSION_DURATION_MS = 30 * 60 * 1000;

const { mockConvexAuthReturn, mockGoogleProvider, mockConvexAuth, mockGoogle } = vi.hoisted(() => {
  const mockConvexAuthReturn = {
    auth: { addHttpRoutes: vi.fn() },
    signIn: vi.fn(),
    signOut: vi.fn(),
    store: {},
    isAuthenticated: vi.fn(),
  };

  const mockGoogleProvider = { id: "google" };
  const mockConvexAuth = vi.fn(() => mockConvexAuthReturn);
  const mockGoogle = vi.fn(() => mockGoogleProvider);

  return { mockConvexAuthReturn, mockGoogleProvider, mockConvexAuth, mockGoogle };
});

vi.mock("@convex-dev/auth/server", () => ({
  convexAuth: mockConvexAuth,
}));

vi.mock("@auth/core/providers/google", () => ({
  default: mockGoogle,
}));

describe("convex auth provider config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("configures Google with select_account prompt", async () => {
    await import("./auth");

    expect(mockGoogle).toHaveBeenCalledWith({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    });
    expect(mockGoogle).toHaveBeenCalledTimes(1);
  });

  it("passes provider and session duration to convexAuth", async () => {
    await import("./auth");

    expect(mockConvexAuth).toHaveBeenCalledWith({
      providers: [mockGoogleProvider],
      session: {
        totalDurationMs: SESSION_DURATION_MS,
      },
    });
    expect(mockConvexAuth).toHaveBeenCalledTimes(1);
  });

  it("re-exports convexAuth return values", async () => {
    const authModule = await import("./auth");
    expect(mockConvexAuth).toHaveBeenCalledTimes(1);
    const convexAuthResult = mockConvexAuth.mock.results[0]?.value as typeof mockConvexAuthReturn;

    expect(authModule.auth).toBe(convexAuthResult.auth);
    expect(authModule.signIn).toBe(convexAuthResult.signIn);
    expect(authModule.signOut).toBe(convexAuthResult.signOut);
    expect(authModule.store).toBe(convexAuthResult.store);
    expect(authModule.isAuthenticated).toBe(convexAuthResult.isAuthenticated);
  });
});
