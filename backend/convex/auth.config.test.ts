import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("auth config", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    delete process.env.CONVEX_SITE_URL;
  });

  it("uses CONVEX_SITE_URL as provider domain and convex as applicationID", async () => {
    process.env.CONVEX_SITE_URL = "https://example.convex.cloud";
    const module = await import("./auth.config");

    expect(module.default).toEqual({
      providers: [
        {
          domain: "https://example.convex.cloud",
          applicationID: "convex",
        },
      ],
    });
  });
});
