import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRedirect = vi.fn((request: { nextUrl: { pathname: string } }, path: string) => ({
  redirect: path,
  from: request.nextUrl.pathname,
}));

type MiddlewareUnderTest = (
  request: { nextUrl: { pathname: string } },
  context: { convexAuth: { isAuthenticated: () => Promise<boolean> } }
) => Promise<unknown>;

const createRouteMatcherMock = vi.fn((patterns: string[]) => {
  return (request: { nextUrl: { pathname: string } }) =>
    patterns.some((pattern) => {
      const basePattern = pattern
        .replace(/\(\.\*\)$/, "")
        .replace(/\/:.*$/, "")
        .replace(/\*$/, "");
      return request.nextUrl.pathname.startsWith(basePattern);
    });
});

vi.mock("@convex-dev/auth/nextjs/server", () => ({
  convexAuthNextjsMiddleware: (handler: unknown) => handler,
  createRouteMatcher: createRouteMatcherMock,
  nextjsMiddlewareRedirect: mockRedirect,
}));

describe("Unauthorized route access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("initializes route matcher once at module load", async () => {
    await import("./middleware");
    expect(createRouteMatcherMock).toHaveBeenCalledTimes(1);
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

  it("does not redirect authenticated users on /login", async () => {
    const middleware = (await import("./middleware")).default as unknown as MiddlewareUnderTest;

    const result = await middleware(
      { nextUrl: { pathname: "/login" } },
      { convexAuth: { isAuthenticated: async () => true } }
    );

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
