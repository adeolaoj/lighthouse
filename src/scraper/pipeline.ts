import Anthropic from "@anthropic-ai/sdk";
import Database from "better-sqlite3";
import * as path from "path";

// =============================================================================
// CONFIGURATION
// =============================================================================

// Source: raw pages crawled by crawler.ts (read-only)
const RAW_DB_PATH = path.join(__dirname, "raw_crawl_database.db");
// Destination: AI classification + extracted lab records
const CRAWL_DB_PATH = path.join(__dirname, "crawl.db");
const MODEL = "claude-haiku-4-5-20251001";
const CONCURRENCY = 5; // parallel Claude calls
const MAX_TEXT_CHARS = 12_000; // truncate long pages before sending to Claude
// Max total chars to feed Claude when merging multiple pages from the same subdomain.
// Each page is given an equal share of this budget.
const MAX_MERGED_TEXT_CHARS = 24_000;

// =============================================================================
// DATABASE SETUP
// =============================================================================

const initCrawlDb = (db: Database.Database): void => {
  db.exec(`
    -- pages table: mirrors raw_crawl_database.db but adds page_category from AI classification
    CREATE TABLE IF NOT EXISTS pages (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      url           TEXT    NOT NULL UNIQUE,
      title         TEXT,
      text          TEXT,
      page_type     TEXT,
      page_category TEXT,   -- set by pipeline: container | leaf | profile | noise
      from_type     TEXT,
      depth         INTEGER,
      last_crawled_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_pages_page_type     ON pages(page_type);
    CREATE INDEX IF NOT EXISTS idx_pages_page_category ON pages(page_category);
    CREATE INDEX IF NOT EXISTS idx_pages_from_type     ON pages(from_type);

    -- labs table: one row per lab, keyed by canonical subdomain (lab_domain)
    CREATE TABLE IF NOT EXISTS labs (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      lab_domain           TEXT NOT NULL UNIQUE,  -- e.g. "hltcoe.jhu.edu"  (grouping key)
      lab_url              TEXT NOT NULL,          -- canonical/best URL for the lab
      page_ids             TEXT NOT NULL,          -- JSON array of contributing page IDs
      page_urls            TEXT NOT NULL,          -- JSON array of contributing page URLs
      lab_name             TEXT,
      lab_description      TEXT,
      head_faculty         TEXT,           -- JSON array of names
      faculty_contact      TEXT,           -- JSON array of emails/links
      research_focus       TEXT,           -- JSON array of short keyword strings
      extraction_notes     TEXT,           -- anything Claude flagged as uncertain
      extracted_at         TEXT NOT NULL DEFAULT (datetime('now', '-5 hours'))
    );
    CREATE INDEX IF NOT EXISTS idx_labs_lab_domain ON labs(lab_domain);
    CREATE INDEX IF NOT EXISTS idx_labs_lab_url    ON labs(lab_url);
  `);
};

// =============================================================================
// TYPES
// =============================================================================

interface Page {
  id: number;
  url: string;
  title: string;
  text: string;
  page_type: string;
  from_type: string;
  depth: number;
}

type PageCategory = "container" | "leaf" | "profile" | "noise";

interface ClassifyResult {
  page_category: PageCategory;
  reasoning: string; // short explanation
}

interface LabRecord {
  lab_name: string | null;
  lab_description: string | null;
  head_faculty: string[]; // names
  faculty_contact: string[]; // emails or contact URLs
  research_focus: string[]; // short keyword phrases
  extraction_notes: string | null;
}

/** A group of pages that all belong to the same subdomain. */
interface PageGroup {
  domain: string;      // e.g. "hltcoe.jhu.edu"
  pages: Page[];
  /** The shortest URL in the group — used as the canonical lab_url. */
  canonicalUrl: string;
}

// =============================================================================
// SUBDOMAIN GROUPING HELPERS
// =============================================================================

/**
 * Extract the "effective subdomain" used as the grouping key.
 *
 * Strategy:
 *   - Use the full hostname (e.g. "hltcoe.jhu.edu", "lcsr.jhu.edu").
 *   - For bare "www.X.edu" or top-level "X.edu" pages that all share the same
 *     base domain, we still keep the full hostname so that two different labs
 *     on separate subdomains are never accidentally merged.
 *
 * Examples:
 *   https://hltcoe.jhu.edu/research/scale/  →  "hltcoe.jhu.edu"
 *   https://hltcoe.jhu.edu/publications/    →  "hltcoe.jhu.edu"
 *   https://lcsr.jhu.edu/                   →  "lcsr.jhu.edu"
 *   https://www.cs.jhu.edu/lab/foo/         →  "www.cs.jhu.edu"
 */
function extractDomainKey(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    // Malformed URL — use the raw string as a unique key so it doesn't merge.
    return url;
  }
}

/**
 * Group an array of pages by their domain key.
 * Within each group the canonical URL is the page whose URL string is shortest
 * (typically the root or near-root page).
 */
function groupPagesByDomain(pages: Page[]): PageGroup[] {
  const map = new Map<string, Page[]>();

  for (const page of pages) {
    const key = extractDomainKey(page.url);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(page);
  }

  return Array.from(map.entries()).map(([domain, grpPages]) => {
    // Sort by URL length ascending, then pick the shortest as canonical.
    const sorted = [...grpPages].sort((a, b) => a.url.length - b.url.length);
    return { domain, pages: sorted, canonicalUrl: sorted[0].url };
  });
}

// =============================================================================
// CLAUDE HELPERS
// =============================================================================

const client = new Anthropic();

// Step 1: Classify a page into container | leaf | profile | noise
async function classifyPage(page: Page): Promise<ClassifyResult> {
  const truncated = page.text.slice(0, MAX_TEXT_CHARS);

  const prompt = `You are classifying web pages scraped from Johns Hopkins CS research sites.

Page URL: ${page.url}
Page title: ${page.title}
Page type hint from crawler: ${page.page_type} (from: ${page.from_type})

--- PAGE TEXT (truncated to ${MAX_TEXT_CHARS} chars) ---
${truncated}
--- END ---

Classify this page into EXACTLY ONE of these categories:

- "leaf"      → A dedicated page for a SINGLE research lab, research group, or project. 
                 Has its own identity, description, and (usually) faculty.
- "container" → An index/directory page listing MULTIPLE labs, groups, or faculty members.
                 Does not describe one lab — describes many.
- "profile"   → A personal faculty or student profile page. About one person, not a lab.
- "noise"     → Navigation, admin, login, 404, or content unrelated to research.

Respond with ONLY valid JSON, no markdown:
{
  "page_category": "<leaf|container|profile|noise>",
  "reasoning": "<one sentence why>"
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (response.content[0] as { type: string; text: string }).text.trim();
  try {
    return JSON.parse(raw) as ClassifyResult;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as ClassifyResult;
    return { page_category: "noise", reasoning: "parse error: " + raw.slice(0, 80) };
  }
}

// Step 2: Extract a unified lab record from one or more pages belonging to the
//         same subdomain.  Pages are concatenated with clear section separators
//         so Claude understands they are different URLs of the same lab site.
async function extractLabRecordFromGroup(group: PageGroup): Promise<LabRecord> {
  const perPageBudget = Math.floor(MAX_MERGED_TEXT_CHARS / group.pages.length);

  const sections = group.pages
    .map((p, i) => {
      const truncated = p.text.slice(0, perPageBudget);
      return `=== PAGE ${i + 1} of ${group.pages.length} ===
URL  : ${p.url}
Title: ${p.title}

${truncated}`;
    })
    .join("\n\n");

  const prompt = `You are extracting structured information about a university research lab.
The content below comes from ${group.pages.length} page(s) all belonging to the same lab website (${group.domain}).
Treat them together as a single source of truth about ONE lab.

--- PAGES ---
${sections}
--- END ---

Extract the following fields. Use null for anything not found. Be concise.
De-duplicate values across pages (e.g. list each faculty member only once).

Respond with ONLY valid JSON, no markdown:
{
  "lab_name": "Full name of the lab/group/center or null",
  "lab_description": "2-4 sentence summary of what the lab does and researches",
  "head_faculty": ["Professor Name", ...],
  "faculty_contact": ["email@jhu.edu or contact URL", ...],
  "research_focus": ["short keyword", "another keyword", ...],
  "extraction_notes": "Any caveats, ambiguities, or things you're uncertain about, or null"
}

Rules:
- research_focus: 4-8 short keyword phrases (e.g. "computer vision", "NLP", "robot manipulation")
- head_faculty: the PI(s) or faculty who lead this lab`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (response.content[0] as { type: string; text: string }).text.trim();
  try {
    return JSON.parse(raw) as LabRecord;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as LabRecord;
    throw new Error("Failed to parse extraction response: " + raw.slice(0, 120));
  }
}

// =============================================================================
// CONCURRENCY HELPER
// =============================================================================

async function runInBatches<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<{ item: T; result?: R; error?: string }[]> {
  const results: { item: T; result?: R; error?: string }[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map(fn));
    settled.forEach((s, idx) => {
      if (s.status === "fulfilled") results.push({ item: batch[idx], result: s.value });
      else results.push({ item: batch[idx], error: String(s.reason) });
    });
    console.log(`  processed ${Math.min(i + batchSize, items.length)} / ${items.length}`);
  }
  return results;
}

// =============================================================================
// MAIN PIPELINE
// =============================================================================

(async () => {
  // Open raw DB (source, read-only) and crawl DB (destination, read-write)
  const rawDb   = new Database(RAW_DB_PATH, { readonly: true });
  const crawlDb = new Database(CRAWL_DB_PATH);
  initCrawlDb(crawlDb);

  // Sync pages from raw_crawl_database.db into crawl.db (without overwriting page_category)
  const rawPages = rawDb.prepare(`SELECT * FROM pages WHERE error IS NULL`).all() as (Page & { last_crawled_at: string })[];
  const syncPage = crawlDb.prepare(`
    INSERT INTO pages (url, title, text, page_type, from_type, depth, last_crawled_at)
    VALUES (@url, @title, @text, @page_type, @from_type, @depth, @last_crawled_at)
    ON CONFLICT(url) DO UPDATE SET
      title           = excluded.title,
      text            = excluded.text,
      page_type       = excluded.page_type,
      from_type       = excluded.from_type,
      depth           = excluded.depth,
      last_crawled_at = excluded.last_crawled_at
  `);
  const syncMany = crawlDb.transaction((rows: typeof rawPages) => {
    for (const r of rows) syncPage.run(r);
  });
  syncMany(rawPages);
  console.log(`\nSynced ${rawPages.length} pages from raw_crawl_database.db → crawl.db`);

  // -------------------------------------------------------------------------
  // PHASE 1: Classify all unclassified pages
  // -------------------------------------------------------------------------
  const unclassified = crawlDb
    .prepare(`SELECT * FROM pages WHERE page_category IS NULL`)
    .all() as Page[];

  console.log(`\n=== PHASE 1: Classifying ${unclassified.length} pages ===\n`);

  const updateCategory = crawlDb.prepare(
    `UPDATE pages SET page_category = ? WHERE id = ?`
  );

  const classifyResults = await runInBatches(unclassified, CONCURRENCY, classifyPage);

  let classifyCounts: Record<string, number> = {};
  for (const { item, result, error } of classifyResults) {
    if (error || !result) {
      console.warn(`  ✗ classify failed for ${item.url}: ${error}`);
      updateCategory.run("noise", item.id);
      continue;
    }
    updateCategory.run(result.page_category, item.id);
    classifyCounts[result.page_category] = (classifyCounts[result.page_category] ?? 0) + 1;
    console.log(`  [${result.page_category.padEnd(9)}] ${item.url.slice(0, 80)}`);
  }

  console.log("\nClassification summary:");
  Object.entries(classifyCounts).forEach(([k, v]) =>
    console.log(`  ${k.padEnd(10)} ${v} pages`)
  );

  // -------------------------------------------------------------------------
  // PHASE 2: Group leaf pages by subdomain, then extract one lab record each
  // -------------------------------------------------------------------------
  const leafPages = crawlDb
    .prepare(`SELECT * FROM pages WHERE page_category = 'leaf'`)
    .all() as Page[];

  // Build domain groups
  const allGroups = groupPagesByDomain(leafPages);

  // Skip groups whose canonical domain is already in the labs table
  const alreadyExtracted = new Set(
    (crawlDb.prepare(`SELECT lab_domain FROM labs`).all() as { lab_domain: string }[]).map(
      (r) => r.lab_domain
    )
  );
  const toExtract = allGroups.filter((g) => !alreadyExtracted.has(g.domain));

  console.log(`\n=== PHASE 2: Extracting ${toExtract.length} lab records ===`);
  console.log(  `             (from ${leafPages.length} leaf pages grouped into ${allGroups.length} domains)\n`);

  const insertLab = crawlDb.prepare(`
    INSERT OR REPLACE INTO labs 
      (lab_domain, lab_url, page_ids, page_urls,
       lab_name, lab_description, head_faculty, faculty_contact,
       research_focus, extraction_notes)
    VALUES
      (@lab_domain, @lab_url, @page_ids, @page_urls,
       @lab_name, @lab_description, @head_faculty, @faculty_contact,
       @research_focus, @extraction_notes)
  `);

  const extractResults = await runInBatches(
    toExtract,
    CONCURRENCY,
    (group) => extractLabRecordFromGroup(group)
  );

  let extractOk = 0;
  let extractFail = 0;
  for (const { item: group, result, error } of extractResults) {
    if (error || !result) {
      console.warn(`  ✗ extract failed for ${group.domain}: ${error}`);
      extractFail++;
      continue;
    }
    insertLab.run({
      lab_domain:       group.domain,
      lab_url:          group.canonicalUrl,
      page_ids:         JSON.stringify(group.pages.map((p) => p.id)),
      page_urls:        JSON.stringify(group.pages.map((p) => p.url)),
      lab_name:         result.lab_name,
      lab_description:  result.lab_description,
      head_faculty:     JSON.stringify(result.head_faculty),
      faculty_contact:  JSON.stringify(result.faculty_contact),
      research_focus:   JSON.stringify(result.research_focus),
      extraction_notes: result.extraction_notes,
    });
    extractOk++;
    const pageCount = group.pages.length;
    console.log(`  ✓ [${pageCount} page${pageCount > 1 ? "s" : ""}] ${result.lab_name ?? group.domain}  (${group.domain})`);
    if (result.research_focus?.length)
      console.log(`    focus: ${result.research_focus.join(", ")}`);
    if (result.head_faculty?.length)
      console.log(`    PI:    ${result.head_faculty.join(", ")}`);
  }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  const labCount = (
    crawlDb.prepare(`SELECT COUNT(*) as c FROM labs`).get() as { c: number }
  ).c;

  // Show merge stats: how many domains had multiple pages collapsed
  const mergedCount = toExtract.filter((g) => g.pages.length > 1).length;
  const mergedPageTotal = toExtract
    .filter((g) => g.pages.length > 1)
    .reduce((sum, g) => sum + g.pages.length, 0);

  console.log(`
=== Pipeline complete ===
Pages synced     : ${rawPages.length} (from raw_crawl_database.db)
Pages classified : ${classifyResults.length}
Leaf pages       : ${leafPages.length}
Domain groups    : ${allGroups.length}  (${mergedCount} multi-page domains, ${mergedPageTotal} pages merged)
Labs extracted   : ${extractOk}  (${extractFail} failed)
Total labs in DB : ${labCount}

Source DB : ${RAW_DB_PATH}
Output DB : ${CRAWL_DB_PATH}

Useful queries:
  -- Labs with multiple pages merged
  SELECT lab_name, lab_domain, json_array_length(page_urls) AS page_count
  FROM labs WHERE json_array_length(page_urls) > 1;

  -- Labs by research focus keyword
  SELECT lab_name, research_focus FROM labs WHERE research_focus LIKE '%vision%';

  -- Labs with known PI
  SELECT lab_name, head_faculty FROM labs WHERE head_faculty != '[]';

Next step: embed lab_description + research_focus for semantic search.
`);

  rawDb.close();
  crawlDb.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});