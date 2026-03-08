import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRedirect = vi.fn((request: { nextUrl: { pathname: string } }, path: string) => ({
  redirect: path,
  from: request.nextUrl.pathname,
}));

type MiddlewareUnderTest = (
  request: { nextUrl: { pathname: string } },
  context: { convexAuth: { isAuthenticated: () => Promise<boolean> } }
) => Promise<unknown>;

vi.mock("@convex-dev/auth/nextjs/server", () => ({
  convexAuthNextjsMiddleware: (handler: unknown) => handler,
  createRouteMatcher:
    (patterns: string[]) =>
    (request: { nextUrl: { pathname: string } }) =>
      patterns.some((pattern) => pattern.startsWith("/results") && request.nextUrl.pathname.startsWith("/results")),
  nextjsMiddlewareRedirect: mockRedirect,
}));

describe("Unauthorized route access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users from protected routes to /login", async () => {
    const middleware = (await import("./middleware")).default as unknown as MiddlewareUnderTest;

    const request = { nextUrl: { pathname: "/results" } };
    const result = await middleware(request, {
      convexAuth: { isAuthenticated: async () => false },
    });

    expect(mockRedirect).toHaveBeenCalledWith(request, "/login");
    expect(result).toEqual({ redirect: "/login", from: "/results" });
  });

  it("allows authenticated users on protected routes", async () => {
    const middleware = (await import("./middleware")).default as unknown as MiddlewareUnderTest;

    const result = await middleware(
      { nextUrl: { pathname: "/results/123" } },
      { convexAuth: { isAuthenticated: async () => true } }
    );

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("does not redirect public routes", async () => {
    const middleware = (await import("./middleware")).default as unknown as MiddlewareUnderTest;

    const result = await middleware(
      { nextUrl: { pathname: "/login" } },
      { convexAuth: { isAuthenticated: async () => false } }
    );

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
