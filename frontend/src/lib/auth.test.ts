import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const installStorageStub = (memoryStorage: Map<string, string>) => {
  vi.stubGlobal("localStorage", {
    setItem: (key: string, value: string) => {
      memoryStorage.set(key, value);
    },
    getItem: (key: string) => memoryStorage.get(key) ?? null,
    removeItem: (key: string) => {
      memoryStorage.delete(key);
    },
  });
};

describe("auth token persistence", () => {
  const memoryStorage = new Map<string, string>();

  beforeEach(() => {
    vi.resetModules();
    memoryStorage.clear();
    installStorageStub(memoryStorage);
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("token survives module reload (simulates refresh) and remains visible across tabs", async () => {
    const { setAuthToken, getAuthToken, AUTH_TOKEN_KEY } = await import("./auth");

    setAuthToken("test-session-token");
    expect(getAuthToken()).toBe("test-session-token");

    vi.resetModules();
    installStorageStub(memoryStorage);

    const { getAuthToken: getAuthTokenAfterReload, AUTH_TOKEN_KEY: reloadedAuthTokenKey } =
      await import("./auth");

    expect(reloadedAuthTokenKey).toBe(AUTH_TOKEN_KEY);
    expect(getAuthTokenAfterReload()).toBe("test-session-token");
    expect(localStorage.getItem(reloadedAuthTokenKey)).toBe("test-session-token");
  });
});
