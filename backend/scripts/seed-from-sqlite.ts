/**
 * One-time seed script: reads labs from crawl.db and inserts them into Convex.
 *
 * Usage (from backend/):
 *   CONVEX_URL=<your-deployment-url> npx tsx scripts/seed-from-sqlite.ts
 *
 * The CONVEX_URL should point to the shared/production deployment, not a local one.
 * Find it in the Convex dashboard or your .env.local as NEXT_PUBLIC_CONVEX_URL.
 */

import Database from "better-sqlite3";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import path from "path";

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Error: CONVEX_URL environment variable is required.");
  process.exit(1);
}

const DB_PATH = path.resolve(
  __dirname,
  "../../src/scraper/crawl.db"
);

type LabRow = {
  lab_url: string;
  lab_name: string | null;
  lab_domain: string;
  lab_description: string | null;
  head_faculty: string | null; // JSON array or null
  research_focus: string | null; // JSON array or null
};

function parseJsonArray(raw: string | null): string | undefined {
  if (!raw) return undefined;
  try {
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : undefined;
  } catch {
    return raw; // already a plain string
  }
}

async function main() {
  const db = new Database(DB_PATH, { readonly: true });
  const rows = db.prepare("SELECT * FROM labs").all() as LabRow[];
  db.close();

  const opportunities = rows.map((row) => ({
    labURL: row.lab_url ?? row.lab_domain,
    labName: row.lab_name ?? "",
    labDescription: row.lab_description ?? "",
    headFaculty: parseJsonArray(row.head_faculty) ?? "",
    researchFocus: parseJsonArray(row.research_focus) ?? "",
  }));

  const client = new ConvexHttpClient(CONVEX_URL!);
  const result = await client.mutation(api.opportunities.seed_opportunities, {
    opportunities,
  });

  console.log(`Inserted ${result.inserted} opportunities into Convex.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
