import * as puppeteer from "puppeteer";
import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";

// =============================================================================
// CONFIGURATION
// =============================================================================

// Entry point — the JHU CS research listing that links out to all labs
const SEED = "https://www.cs.jhu.edu/research/";

// URL path segments that indicate non-research pages on cs.jhu.edu.
// These are skipped entirely during crawling.
const BLOCKED_PATHS = [
  "wp-content", "wp-json", "feed", "news", "cs-newsletter",
  "message-from-dept-head", "events", "calendar", "seminars", "lecture-series",
  "it-support", "diversity-and-inclusion", "combined-bachelors-masters",
  "academic-integrity-code", "150", "accessibility", "administrative-staff",
  "alumni", "advisory", "advising-manual", "wellbeing",
  "academic-programs", "admissions",
];

// Full jhu.edu subdomains to skip — these are admin/portal sites, not research.
// Any other *.jhu.edu subdomain (e.g. lcsr.jhu.edu, ai.jhu.edu) will be
// followed because it likely points to a research institute or lab.
const BLOCKED_SUBDOMAINS = [
  "apply.jhu.edu", "studentaffairs.jhu.edu", "hr.jhu.edu",
  "giving.jhu.edu", "hub.jhu.edu", "alerts.jhu.edu", "imagine.jhu.edu",
  "e-catalogue.jhu.edu",
];

// URL path keywords that strongly suggest a dedicated research lab page.
// /people/ and /faculty/ intentionally excluded — those are profile pages.
const LAB_PATH_HINTS = [
  "/labs/", "/lab/", "/research/", "/~",
  "/projects/", "/group/", "/center/", "/institute/",
];

// cs.jhu.edu path patterns that indicate individual faculty/people profile pages.
// These pages are STORED but their outbound links are only followed when the
// referrer page was itself a lab page (external_lab or lab_hint).
// This lets us capture faculty who are part of a lab without crawling every
// faculty profile reachable from the top-level cs.jhu.edu navigation.
const FACULTY_PROFILE_PATHS = [
  "/faculty/", "/people/", "/staff/", "/phd-students/",
  "/postdocs/", "/about/", "/team/",
];

// page_types that count as "came from a lab" for the faculty-profile gate
const LAB_REFERRER_TYPES = new Set(["external_lab", "lab_hint"]);

// How many pages to visit before stopping
const MAX_PAGES = 500;

// Maximum link-following depth from the seed:
//   depth 0 = seed (cs.jhu.edu/research/)
//   depth 1 = pages linked directly from seed (cs.jhu.edu lab index pages)
//   depth 2 = pages linked from those (e.g. lcsr.jhu.edu homepage)
//   depth 3 = sub-pages within external lab sites (individual leaf lab pages)
const MAX_DEPTH = 3; 

// SQLite database written to the working directory.
// Stores raw crawl output only — no AI classification.
// pipeline.ts reads this and writes AI results to crawl.db.
const DB_PATH = path.join(__dirname, "raw_crawl_database.db");

// =============================================================================
// URL UTILITIES
// =============================================================================

// Strip URL fragments (#...) so equivalent URLs don't get crawled twice
const norm = (u: string): string | null => {
  try { const x = new URL(u); x.hash = ""; return x.toString(); }
  catch { return null; }
};

// Return true if a URL should be crawled:
//   - must be on a jhu.edu hostname
//   - must not be a blocked subdomain
//   - must not contain a blocked path segment (non-research pages)
//   - must not be a static asset
const isValid = (u: string): boolean => {
  try {
    const parsed = new URL(u);
    const l = u.toLowerCase();
    return (
      parsed.hostname.endsWith("jhu.edu") &&
      l.startsWith("http") &&
      ![".pdf", ".png", ".jpg", ".jpeg", ".svg", ".zip", ".gif", ".mp4"].some(e => l.endsWith(e)) &&
      !BLOCKED_PATHS.some(w => l.includes(w)) &&
      !BLOCKED_SUBDOMAINS.includes(parsed.hostname)
    );
  } catch { return false; }
};

// Assign a page_type tag stored in the DB.
//
//   "seed"         – the single entry point (cs.jhu.edu/research/)
//   "external_lab" – any non-cs.jhu.edu subdomain, e.g. lcsr.jhu.edu
//   "lab_hint"     – cs.jhu.edu page whose path suggests a lab or research group
//   "faculty"      – cs.jhu.edu page whose path suggests a personal profile
//   "general"      – everything else (navigation pages, overviews, etc.)
const classifyUrl = (u: string): "seed" | "external_lab" | "lab_hint" | "faculty" | "general" => {
  if (u === SEED) return "seed";
  const { hostname, pathname } = new URL(u);
  const isMainSite = hostname === "www.cs.jhu.edu" || hostname === "cs.jhu.edu";
  if (!isMainSite) return "external_lab";
  if (LAB_PATH_HINTS.some(h => pathname.includes(h))) return "lab_hint";
  if (FACULTY_PROFILE_PATHS.some(h => pathname.includes(h))) return "faculty";
  return "general";
};

// Returns true if this URL is a faculty/people profile on the main cs.jhu.edu site.
// Used to gate whether we follow the page's outbound links.
const isFacultyProfile = (u: string): boolean => classifyUrl(u) === "faculty";

// Decide whether to enqueue outbound links from a given page.
//
// Rules:
//   - Non-faculty pages: always follow links (subject to depth/validity checks)
//   - Faculty profile pages: only follow links if the page was reached FROM a
//     lab page (external_lab or lab_hint). This prevents the crawler from
//     fanning out across all of cs.jhu.edu just because the research index
//     links to every faculty member.
const shouldFollowLinks = (url: string, fromType: string): boolean => {
  if (!isFacultyProfile(url)) return true;
  return LAB_REFERRER_TYPES.has(fromType);
};

// =============================================================================
// CONTENT EXTRACTION
// =============================================================================

// Extract the page title and clean body text inside the browser context.
// Removes navigation chrome before reading so menus and footers are not stored.
// Prefers semantic <main> or common CMS wrappers; falls back to document.body.
//
// IMPORTANT: call this AFTER collecting outbound links — this function mutates
// the DOM by removing nav/footer/etc. elements.
const extractContent = async (page: puppeteer.Page): Promise<{ title: string; text: string }> => {
  return page.evaluate(() => {
    ["nav", "footer", "aside", "header", "script", "style", "noscript"]
      .forEach(tag => document.querySelectorAll(tag).forEach(el => el.remove()));

    const title = document.title?.trim() ?? "";

    const main =
      document.querySelector("main") ??
      document.querySelector('[role="main"]') ??
      document.querySelector(".entry-content") ??
      document.querySelector("#content") ??
      document.body;

    const text = (main?.innerText ?? "")
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return { title, text };
  });
};

// =============================================================================
// DATABASE
// =============================================================================

// Initialise (or reuse) the raw crawl database.
//
// Table: pages
//   url            – unique crawled URL (natural key, used for upserts)
//   title          – <title> tag text
//   text           – cleaned plain-text body
//   page_type      – crawler-assigned tag: seed | external_lab | lab_hint | faculty | general
//   from_type      – page_type of the referrer that led to this page
//   depth          – BFS depth from seed
//   last_crawled_at – timestamp of last crawl attempt
//   error          – non-NULL if navigation failed; NULL on success
//
// NOTE: page_category is intentionally absent — AI classification happens
// in pipeline.ts, which reads this DB and writes results to crawl.db.
const initDb = (dbPath: string): Database.Database => {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      url             TEXT    NOT NULL UNIQUE,
      title           TEXT,
      text            TEXT,
      page_type       TEXT,
      from_type       TEXT,
      depth           INTEGER,
      last_crawled_at TEXT NOT NULL DEFAULT (datetime('now', '-5 hours')),
      error           TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_pages_page_type ON pages(page_type);
    CREATE INDEX IF NOT EXISTS idx_pages_from_type ON pages(from_type);
    CREATE INDEX IF NOT EXISTS idx_pages_depth     ON pages(depth);
  `);
  return db;
};

// Insert or update a page row. Re-running the crawler refreshes content on
// existing rows rather than creating duplicates.
const upsertPage = (
  db: Database.Database,
  row: {
    url: string; title: string; text: string;
    page_type: string; from_type: string;
    depth: number; error?: string;
  }
): void => {
  db.prepare(`
    INSERT INTO pages (url, title, text, page_type, from_type, depth, error)
    VALUES (@url, @title, @text, @page_type, @from_type, @depth, @error)
    ON CONFLICT(url) DO UPDATE SET
      title           = excluded.title,
      text            = excluded.text,
      page_type       = excluded.page_type,
      from_type       = excluded.from_type,
      depth           = excluded.depth,
      last_crawled_at = datetime('now', '-5 hours'),
      error           = excluded.error
  `).run({
    url: row.url,
    title: row.title,
    text: row.text,
    page_type: row.page_type,
    from_type: row.from_type,
    depth: row.depth,
    error: row.error ?? null,
  });
};

// =============================================================================
// CRAWL LOOP
// =============================================================================

(async () => {
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("Deleted existing database: " + DB_PATH);
  }

  const db = initDb(DB_PATH);
  console.log(`Database: ${DB_PATH}`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30_000);
  page.setDefaultTimeout(30_000);

  await page.setRequestInterception(true);
  page.on("request", req => {
    if (["image", "stylesheet", "font", "media"].includes(req.resourceType())) req.abort();
    else req.continue();
  });

  // BFS queue. Each entry tracks:
  //   depth    – hops from seed, enforces MAX_DEPTH
  //   fromType – page_type of the parent, used to gate faculty profile following
  const visited = new Set<string>();
  const seen    = new Set<string>([norm(SEED)!]);
  const queue: { url: string; depth: number; fromType: string }[] = [
    { url: SEED, depth: 0, fromType: "seed" }
  ];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const { url, depth, fromType } = queue.shift()!;
    const normalized = norm(url);
    if (!normalized || !isValid(normalized)) continue;

    visited.add(normalized);
    const pageType = classifyUrl(normalized);

    console.log(`[${visited.size}/${MAX_PAGES}] depth=${depth} type=${pageType} from=${fromType} -> ${normalized}`);

    let title    = "";
    let text     = "";
    let errorMsg: string | undefined;
    let links:   string[] = [];

    try {
      await page.goto(normalized, { waitUntil: "domcontentloaded" });

      // Collect outbound links BEFORE extractContent mutates the DOM
      links = await page.$$eval("a", (as: Element[]) =>
        (as as HTMLAnchorElement[]).map(a => a.href).filter(Boolean)
      );

      ({ title, text } = await extractContent(page));

    } catch (err: unknown) {
      errorMsg = String(err);
      console.warn(`  ✗ failed: ${errorMsg.slice(0, 120)}`);
    }

    upsertPage(db, { url: normalized, title, text, page_type: pageType, from_type: fromType, depth, error: errorMsg });

    // Only follow outbound links if:
    //   1. The page loaded successfully
    //   2. We haven't hit MAX_DEPTH
    //   3. The page passes the faculty-profile gate (faculty pages only followed
    //      when we arrived from a lab page, not from general navigation)
    if (!errorMsg && depth < MAX_DEPTH && shouldFollowLinks(normalized, fromType)) {
      const filtered = [...new Set(links.map(norm).filter(Boolean) as string[])]
        .filter(isValid);

      for (const l of filtered) {
        if (!seen.has(l)) {
          seen.add(l);
          // Pass this page's type as fromType so children know their provenance
          queue.push({ url: l, depth: depth + 1, fromType: pageType });
        }
      }

      const saved = (db.prepare("SELECT COUNT(*) as c FROM pages WHERE error IS NULL").get() as { c: number }).c;
      console.log(`  ✓ ${text.length} chars | ${filtered.length} links queued | queue: ${queue.length} | db rows: ${saved}`);
    } else if (isFacultyProfile(normalized) && !LAB_REFERRER_TYPES.has(fromType)) {
      console.log(`  ↷ faculty profile reached from '${fromType}' — stored but links not followed`);
    }
  }

  // Summary broken down by page_type × from_type so you can sanity-check
  // how many faculty profiles came from labs vs. general navigation
  const stats = db.prepare(`
    SELECT page_type, from_type, COUNT(*) as cnt, AVG(LENGTH(text)) as avg_chars
    FROM pages WHERE error IS NULL
    GROUP BY page_type, from_type
    ORDER BY page_type, from_type
  `).all() as { page_type: string; from_type: string; cnt: number; avg_chars: number }[];

  console.log("\n=== Crawl complete ===");
  console.log(`Total visited: ${visited.size}`);
  console.log("\nBreakdown by page_type × from_type:");
  stats.forEach(r =>
    console.log(
      `  ${r.page_type.padEnd(14)} from=${r.from_type.padEnd(14)} ` +
      `${String(r.cnt).padStart(4)} pages  ~${Math.round(r.avg_chars).toLocaleString()} chars avg`
    )
  );
  console.log(`\nDatabase saved to: ${DB_PATH}`);
  console.log(`\nNext step: run pipeline.ts to classify pages and extract lab records into crawl.db`);

  await browser.close();
  db.close();
})().catch(err => { console.error(err); process.exit(1); });