import { describe, expect, it, vi } from "vitest";

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

vi.mock("@convex-dev/auth/server", () => ({
  convexAuth: mockConvexAuth,
}));

vi.mock("@auth/core/providers/google", () => ({
  default: mockGoogle,
}));

describe("convex auth provider config", () => {
  it("configures Google with select_account prompt", async () => {
    await import("./auth");

    expect(mockGoogle).toHaveBeenCalledWith({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    });
  });

  it("passes provider and session duration to convexAuth", async () => {
    await import("./auth");

    expect(mockConvexAuth).toHaveBeenCalledWith({
      providers: [mockGoogleProvider],
      session: {
        totalDurationMs: 60 * 1000 * 30,
      },
    });
  });

  it("re-exports convexAuth return values", async () => {
    const authModule = await import("./auth");

    expect(authModule.auth).toBe(mockConvexAuthReturn.auth);
    expect(authModule.signIn).toBe(mockConvexAuthReturn.signIn);
    expect(authModule.signOut).toBe(mockConvexAuthReturn.signOut);
    expect(authModule.store).toBe(mockConvexAuthReturn.store);
    expect(authModule.isAuthenticated).toBe(mockConvexAuthReturn.isAuthenticated);
  });
});
