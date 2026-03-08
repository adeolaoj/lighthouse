import { describe, expect, it } from "vitest";

describe("auth config", () => {
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
