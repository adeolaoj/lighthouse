import { describe, it, expect, vi, beforeEach } from "vitest";

// capturedHandler is set when the module is imported below.
// Vitest runs tests single-threaded, so this is safe across all tests in this file.
let capturedHandler: (ctx: unknown, args: unknown) => Promise<unknown>;

vi.mock("./_generated/server", () => ({
  query: vi.fn((config: { handler: typeof capturedHandler }) => {
    capturedHandler = config.handler;
    return config;
  }),
}));

await import("./opportunities");

// ── helpers ───────────────────────────────────────────────────────────────────

function makeDbRecord(overrides: Record<string, unknown> = {}) {
  return {
    _id: "id-1",
    _creationTime: 1700000000000,
    labURL: "https://example.com/lab",
    labName: "Vision Lab",
    labDescription: "Research on computer vision.",
    headFaculty: "Dr. Smith",
    researchFocus: "Computer Vision",
    researchPositionTitle: "Research Assistant",
    ...overrides,
  };
}

// Both collect and take resolve to rows — the handler's branching decides which gets called.
function makeCtx(rows: unknown[]) {
  const queryResult = {
    collect: vi.fn().mockResolvedValue(rows),
    take: vi.fn().mockResolvedValue(rows),
  };
  return {
    db: {
      query: vi.fn().mockReturnValue(queryResult),
    },
    _queryResult: queryResult,
  };
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("get_opportunities handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty array when there are no opportunities", async () => {
    const { db, _queryResult } = makeCtx([]);
    const result = await (capturedHandler as Function)({ db }, {});

    expect(_queryResult.collect).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("calls collect() when no limit is provided", async () => {
    const { db, _queryResult } = makeCtx([makeDbRecord()]);
    await (capturedHandler as Function)({ db }, {});

    expect(_queryResult.collect).toHaveBeenCalled();
    expect(_queryResult.take).not.toHaveBeenCalled();
  });

  it("calls take() with the limit when limit is provided", async () => {
    const { db, _queryResult } = makeCtx([makeDbRecord()]);
    await (capturedHandler as Function)({ db }, { limit: 5 });

    expect(_queryResult.take).toHaveBeenCalledWith(5);
    expect(_queryResult.collect).not.toHaveBeenCalled();
  });

  it("calls take(0) when limit is 0, not collect()", async () => {
    const { db, _queryResult } = makeCtx([]);
    await (capturedHandler as Function)({ db }, { limit: 0 });

    expect(_queryResult.take).toHaveBeenCalledWith(0);
    expect(_queryResult.collect).not.toHaveBeenCalled();
  });

  it("maps _id to id and _creationTime to postedAt", async () => {
    const record = makeDbRecord({ _id: "abc123", _creationTime: 9999999 });
    const { db } = makeCtx([record]);
    const result = (await (capturedHandler as Function)({ db }, {})) as { id: string; postedAt: number }[];

    expect(result[0].id).toBe("abc123");
    expect(result[0].postedAt).toBe(9999999);
  });

  it("returns all expected fields for a complete record", async () => {
    const { db } = makeCtx([makeDbRecord()]);
    const result = (await (capturedHandler as Function)({ db }, {})) as Record<string, unknown>[];

    expect(result[0]).toEqual({
      id: "id-1",
      labURL: "https://example.com/lab",
      labName: "Vision Lab",
      labDescription: "Research on computer vision.",
      headFaculty: "Dr. Smith",
      researchFocus: "Computer Vision",
      researchPositionTitle: "Research Assistant",
      postedAt: 1700000000000,
    });
  });

  it("passes through undefined for missing optional fields", async () => {
    const record = makeDbRecord({ researchFocus: undefined, researchPositionTitle: undefined });
    const { db } = makeCtx([record]);
    const result = (await (capturedHandler as Function)({ db }, {})) as Record<string, unknown>[];

    expect(result[0].researchFocus).toBeUndefined();
    expect(result[0].researchPositionTitle).toBeUndefined();
  });

  it("returns one result per db record", async () => {
    const records = [makeDbRecord({ _id: "a" }), makeDbRecord({ _id: "b" }), makeDbRecord({ _id: "c" })];
    const { db } = makeCtx(records);
    const result = (await (capturedHandler as Function)({ db }, {})) as unknown[];

    expect(result).toHaveLength(3);
  });

  it("does not include _id or _creationTime as raw fields in the output", async () => {
    const { db } = makeCtx([makeDbRecord()]);
    const result = (await (capturedHandler as Function)({ db }, {})) as Record<string, unknown>[];

    expect(result[0]).not.toHaveProperty("_id");
    expect(result[0]).not.toHaveProperty("_creationTime");
  });
});
