# Iteration 2 Plan

<!-- Due: Tuesday 6 PM of Week 1 of the iteration -->

## Requirements & Acceptance Criteria

### R5 – Agentic Playwright Scraping Pipeline

**Description:** Replace the Puppeteer-based scraper with an agentic workflow powered by Playwright and LlamaIndex. Playwright handles the actual page loading and content extraction. LlamaIndex drives the agentic link selection (deciding which internal links to follow based on relevance) and the chunking and embedding of scraped content. Scraped data is stored directly in Convex (no SQLite intermediary).

- **Acceptance Criteria:**
  - [ ] The Puppeteer dependency is removed and replaced with Playwright.
  - [ ] Given a starting URL, the playwright (at depths 0 and 1) crawls internal links and decides which paths are relevant to research opportunities without a manually maintained allowlist or blocklist.
  - [ ] At URL depth 2, the agent (using LlamaIndex calling OpenAI's functions on model gpt-4o-mini) filters URLs that are related to research opportunities, and does not crawl irrelevant paths (e.g., news archives, calendars, administrative pages) — skipping decisions are logged so they can be reviewed.
  - [ ] Evaluator agent that evaluates the quality of the web-scraped data. If certain fields of the research lab are missing, the evaluator can trigger another web-crawl seeding from the lab URL, a max number of evaluation loops will be set to prevent infinite loops.
  - [ ] Clean scraped opportunity data is written directly to Convex, with no intermediate SQLite storage.
  - [ ] Upsert logic prevents duplicate entries: re-running the scraper on the same URL updates existing records rather than creating new ones.
  - [ ] If a page is unreachable (404, timeout, etc.), the pipeline logs the failure and continues without crashing.
  - [ ] A developer can manually trigger the scrape pipeline via a script or admin endpoint for testing.
  - [ ] Scraped data is queryable from Convex and renders correctly on the results page.
  - [ ] Scraped data is embedded and vectorized in a vector database, enabling semantic vector search for later student resume matching.

---

### R6 – Periodic Scraping & Data Freshness

**Description:** A scheduled process periodically re-runs the agentic scraping pipeline to keep opportunity data up to date. Stale opportunities that no longer exist on source pages are removed.

- **Acceptance Criteria:**
  - [ ] A scheduled job runs the scraping pipeline at a defined, agreed-upon interval (monthly).
  - [ ] The scheduler can be verified as running via logs that capture: start time, pages visited, records added/updated, and any errors.
  - [ ] After a scheduled run completes, newly added or changed opportunities are reflected on the results page on next load.
  - [ ] Opportunities from source pages that no longer exist are removed from Convex after a scheduled run.
  - [ ] The scheduled job does not block or degrade the user-facing application during execution.

---

### R7 – User Onboarding & Profile Creation

**Description:** New users are guided through an onboarding screen to create a personal profile after their first login. Existing users can view and edit their profile on a dedicated profile screen.

- **Acceptance Criteria:**
  - [ ] After first login, new users are redirected to an onboarding screen before reaching the results page.
  - [ ] The onboarding screen allows users to upload a resume (PDF) and optionally enter courses taken and research focus preferences.
  - [ ] Extracted profile data is displayed to the user for review and manual correction before being saved.
  - [ ] Users can skip optional fields (courses, preferences) and complete them later from the profile screen.
  - [ ] A personal profile screen is accessible post-onboarding where users can view and edit all stored profile fields.
  - [ ] Sensitive fields (home address, phone number, GPA) are not stored; the system redacts them before persistence.
  - [ ] Returning users who have already completed onboarding are not shown the onboarding screen again.
  - [ ] The sidebar displays the authenticated user's profile information (e.g., name and profile photo sourced from their Google account).
  - [ ] The onboarding and profile screens render correctly on both desktop and mobile browsers.

---

### R8 – Resume Feature Extraction & Opportunity Matching

**Description:** LlamaIndex parses uploaded resume PDFs, extracts structured features, and handles chunking and embedding of the extracted data. This data, combined with stated preferences, is used to categorize and rank research opportunities that closely match the user's background.

- **Acceptance Criteria:**
  - [ ] The agent extracts the following fields from an uploaded PDF resume: projects, work experience, technical skills, soft skills, college grade level, and extracurricular activities.
  - [ ] Extracted data is chunked and embedded into the system's long-term memory (Convex vector store).
  - [ ] The system uses extracted resume data and user preferences to categorize opportunities as strong, moderate, or weak matches.
  - [ ] Matched and sorted opportunities are returned to the results page in ranked order.
  - [ ] If no resume has been uploaded, the results page falls back to displaying unranked opportunities with a prompt to complete the profile.
  - [ ] The extraction and matching pipeline does not store sensitive personal information (address, phone, GPA).

---

### R9 – UI/UX Improvements

**Description:** Address a set of visual and interaction issues identified during Iteration 1. This includes a redesigned landing page, UI color update, results page quality-of-life improvements (pagination, text truncation, improved empty-field handling), and a logout button.

- **Acceptance Criteria:**
  - [ ] The application's primary color scheme is updated away from purple; the new palette is applied consistently across all pages.
  - [ ] The landing page has a two-panel layout: login/signup on the left, and an overview of the app (description, key features) on the right (or bottom on mobile).
  - [ ] A logout button is accessible from all authenticated pages and correctly ends the user session and redirects to the login page.
  - [ ] The results page is paginated; users can navigate between pages of results rather than seeing one long list.
  - [ ] Lab descriptions longer than a defined character limit are truncated with a "Show more" toggle that expands the full text inline.
  - [ ] Opportunity cards display researcher information and research focus with a consistent, readable layout when values are present.
  - [ ] When researcher information or research focus is missing, the card displays a styled placeholder (e.g., a muted "Not specified" badge) rather than blank space or an awkward gap.
  - [ ] All changes render correctly on both desktop and mobile browsers.

---

### R10 – Performance Audit

**Description:** Invite someone outside the team to interact with the codebase and running application to identify vulnerabilities, usability issues, bugs, and performance bottlenecks, and suggest fixes. Note all findings before the end of the iteration.

- **Acceptance Criteria:**
  - [ ] An external reviewer (outside the core team) is recruited and given access to the codebase and a running instance of the application.
  - [ ] The reviewer exercises core user flows (login, onboarding, scraping, opportunity browsing, resume upload/matching) and inspects the codebase for issues.
  - [ ] Findings are documented in a written audit summary covering: vulnerabilities, usability problems, bugs, and performance bottlenecks.
  - [ ] All critical and high-severity findings are noted to be resolved by the next iteration.
  - [ ] Medium and low-severity findings are logged as GitHub issues for future iterations.
  - [ ] No API keys, OAuth secrets, or session tokens are exposed in client-side code or committed to the repository.

---

## Coordination & Design Decisions

### Key Design Decisions

- **Scraping tool split:** Playwright handles browser automation and raw content extraction. LlamaIndex drives the agentic layer — scoring link relevance, deciding which paths to follow, and chunking/embedding the extracted content.
- **LlamaIndex link scoring:** LlamaIndex will use an LLM to score each discovered link's relevance before Playwright crawls it. Links below a defined relevance threshold are skipped and logged. The team must agree on the threshold and scoring prompt before implementation begins.
- **Resume parsing:** LlamaIndex parses uploaded PDF resumes and handles chunking and embedding of extracted features. The Claude API is not used for PDF extraction.
- **Storage:** All scraped data flows directly into Convex. The SQLite seed script (`backend/scripts/seed-from-sqlite.ts`) is deprecated and will be removed once the Playwright/LlamaIndex pipeline is verified end-to-end.
- **Stale opportunity policy:** After each scheduled run, any opportunity whose `sourceUrl` was visited but produced no matching content is deleted from Convex. URLs that were unreachable (network errors) are not deleted — only those confirmed absent.
- **Onboarding routing:** The frontend checks a `profileComplete` flag on the Convex user record. If `false` after login, the user is redirected to `/onboard`. This flag is set to `true` on first save.
- **Convex schema additions:** Adding `users` table fields: `profileComplete` (boolean), `resumeEmbeddingId` (optional reference), `courses` (array of strings), `researchPreferences` (string). Any schema change must be documented in the PR description.
- **Embedding model:** OpenAI `text-embedding-3-small` for both opportunity chunks and resume chunks, invoked via LlamaIndex (consistent with Iteration 1 embedding work).

### Task Dependencies

|              Task               |                        Depends On                        |
|:-------------------------------:|:--------------------------------------------------------:|
| Playwright crawler              | Playwright installed; starting URL list confirmed        |
| Convex direct storage           | Convex schema updated for new fields (if any)            |
| Periodic scheduler              | Playwright pipeline verified end-to-end                  |
| Stale opportunity handling      | Scheduler implemented; deletion policy decided           |
| Onboarding UI                   | Convex `users` schema updated; routing logic agreed      |
| Profile screen                  | Onboarding flow complete; user record schema stable      |
| Resume extraction agent         | LlamaIndex integrated; PDF parsing pipeline confirmed    |
| Opportunity matching            | Resume embeddings stored; opportunity embeddings present |
| Results page (ranked view)      | Matching logic complete; ranked query endpoint built     |
| Landing page redesign           | Color palette decided by team                            |
| Pagination                      | Results page data fetch stable                           |
| Logout button                   | Session management implemented (Iteration 1)             |
| Security audit fixes            | Audit findings documented                                |

---

## Task Breakdown

## Task Breakdown


### R5 – Agentic Playwright Scraping Pipeline
- Owner: @alysha
- Supporter(s): @ariel


- Task: Install Playwright and Remove Puppeteer Dependency
 - Type: task
 - Assignee(s): @ariel


- Task: Integrate LlamaIndex for Agentic Link Scoring at Depth 2
 - Type: task
 - Assignee(s): @ariel


- Task: Implement Evaluator Agent for Web-Scraped Data Quality
 - Type: task
 - Assignee(s): @alysha


- Task: Implement Direct Convex Storage for Scraped Data
 - Type: task
 - Assignee(s): @alysha


- Task: Remove SQLite Seed Script and Dependencies
 - Type: task
 - Assignee(s): @alysha


- Task: Implement Scraper Error Handling and Logging
 - Type: task
 - Assignee(s): @alysha


- Task: Expose Manual Trigger for the Playwright Scraping Pipeline
 - Type: task
 - Assignee(s): @ariel


- Task: End-to-End Test of Playwright Scraping Pipeline
 - Type: task
 - Assignee(s): @ariel


---


### R6 – Periodic Scraping & Data Freshness
- Owner: @ryan
- Supporter(s): @alysha


- Task: Implement Convex Scheduled Function for Monthly Scraping
 - Type: task
 - Assignee(s): @alysha


- Task: Add Structured Logging to Each Scheduled Scraping Run
 - Type: task
 - Assignee(s): @ryan


- Task: Implement Stale Opportunity Removal
 - Type: task
 - Assignee(s): @ryan


- Task: Test Periodic Scheduler and Stale Data Handling
 - Type: task
 - Assignee(s): @alysha


---


### R7 – User Onboarding & Profile Creation
- Owner: @ariel
- Supporter(s): @nikay


- Task: Update Convex `users` Schema for Profile Fields
 - Type: task
 - Assignee(s): @ariel


- Task: Implement Post-Login Routing Logic for Onboarding
 - Type: task
 - Assignee(s): @ariel


- Task: Build Onboarding Screen UI
 - Type: task
 - Assignee(s): @ariel @adeola


- Task: Build Personal Profile Screen
 - Type: task
 - Assignee(s): @nikay


- Task: Implement Backend Mutation to Save and Update User Profile
 - Type: task
 - Assignee(s): @nikay


- Task: Update Sidebar to Display Authenticated User's Profile Information
 - Type: task
 - Assignee(s): @nikay


- Task: Test User Onboarding Flow and Profile Screen
 - Type: task
 - Assignee(s): @nikay


---


### R8 – Resume Feature Extraction & Opportunity Matching
- Owner: @adeola
- Supporter(s): @ryan


- Task: Integrate LlamaIndex for Resume PDF Parsing
 - Type: task
 - Assignee(s): @adeola, @ryan


- Task: Chunk and Embed Extracted Resume Data into Convex Vector Store
 - Type: task
 - Assignee(s): @Adeola


- Task: Implement Opportunity Matching and Ranking Logic
 - Type: task
 - Assignee(s): @ariel


- Task: Build Convex Query for Ranked Opportunities
 - Type: task
 - Assignee(s): @Adeola


- Task: Update Results Page to Display Ranked Opportunities
 - Type: task
 - Assignee(s): @ryan


- Task: Test Resume Extraction, Embedding, and Opportunity Matching
 - Type: task
 - Assignee(s): @Adeola


---


### R9 – UI/UX Improvements
- Owner: @nikay
- Supporter(s): @adeola


- Task: Update Application Color Scheme
 - Type: task
 - Assignee(s): @nikay


- Task: Redesign Landing Page with Two-Panel Layout
 - Type: task
 - Assignee(s): @nikay


- Task: Implement Logout Button
 - Type: task
 - Assignee(s): @nikay


- Task: Implement Pagination on the Results Page
 - Type: task
 - Assignee(s): @Adeola


- Task: Implement Text Truncation with "Show More" Toggle on Opportunity Cards
 - Type: task
 - Assignee(s): @nikay


- Task: Improve Opportunity Card Layout for Researcher Info and Research Focus
 - Type: task
 - Assignee(s): @Adeola


- Task: Test UI/UX Improvements
 - Type: task
 - Assignee(s): @Adeola
- Task: Add user onboarding flow for research interests
 - Type: task
 - Assignee(s): @nikay


---

### R10 – Performance Audit
- Owner: @madooei
- Supporter(s):


- Task: Conduct External Performance and Vulnerability Audit
 - Type: task
 - Assignee(s): @madooei


- Task: Document Audit Findings
 - Type: task
 - Assignee(s): @madooei


- Task: Resolve Critical and High-Severity Audit Findings
 - Type: task
 - Assignee(s): @madooei


- Task: Log Medium and Low-Severity Audit Findings as GitHub Issues
 - Type: task
 - Assignee(s): @madooei

