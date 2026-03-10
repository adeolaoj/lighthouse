# Iteration 2 GitHub Issues

**Milestone:** Iteration 2
**Labels:** `feature`, `task`, or `bug` (one per issue)

---

## R5 – Agentic Playwright Scraping Pipeline

---

### Issue: Install Playwright and Remove Puppeteer Dependency

**Label:** `task`
**Milestone:** Iteration 2
**Assignee:** @Ariel

---

#### Description

Remove the existing Puppeteer dependency from the project and install Playwright in its place. Verify that Playwright can successfully load Hopkins CS and LCSR department pages.

#### Acceptance Criteria

- [ ] Puppeteer is removed from `package.json` and all related configuration files
- [ ] Playwright is installed and listed as a project dependency
- [ ] Playwright can successfully load at least one Hopkins CS or LCSR page in a test run
- [ ] No Puppeteer references remain in the codebase

---

### Issue: Integrate LlamaIndex for Agentic Link Scoring at Depth 2

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Integrate LlamaIndex to act as the agentic decision layer for the web scraper. At URL depth 2, LlamaIndex calls OpenAI's functions (model `gpt-4o-mini`) to score each discovered link's relevance to research opportunities. Links that score below the agreed threshold are skipped; skipping decisions are logged.

At depths 0 and 1, Playwright crawls all internal links without filtering.

#### Acceptance Criteria

- [ ] At depths 0 and 1, Playwright follows all internal links without LlamaIndex filtering
- [ ] At depth 2, LlamaIndex evaluates each discovered URL using `gpt-4o-mini` and returns a relevance score
- [ ] Links below the agreed relevance threshold are skipped and not crawled
- [ ] Each skipped link and the reason for skipping are written to the pipeline log
- [ ] Irrelevant paths (e.g., news archives, calendars, administrative pages) are consistently skipped across test runs

---

### Issue: Implement Evaluator Agent for Web-Scraped Data Quality

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Implement an evaluator agent that checks the quality of scraped research lab data after each crawl. If required fields (e.g., lab name, professor, research focus) are missing, the evaluator triggers a re-crawl seeded from the lab's root URL. A maximum loop count must be enforced to prevent infinite loops.

#### Acceptance Criteria

- [ ] After each scrape, the evaluator checks every stored record for required fields
- [ ] If required fields are missing, the evaluator triggers a re-crawl from the lab's root URL
- [ ] The maximum number of evaluation loops is configurable and enforced (no infinite loops)
- [ ] The evaluator logs each re-crawl trigger, including which fields were missing and which URL was re-seeded
- [ ] Records that still have missing fields after the max loop count are stored as-is with a flag indicating incomplete data

---

### Issue: Implement Direct Convex Storage for Scraped Data

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Implement the storage layer that writes clean scraped opportunity data directly into Convex with upsert logic. There should be no intermediate SQLite storage. Re-running the scraper on the same source URL must update the existing record rather than create a duplicate.

#### Acceptance Criteria

- [ ] Scraped opportunity data is written directly to Convex with no intermediate SQLite step
- [ ] Re-running the scraper on the same source URL updates the existing Convex record (upsert)
- [ ] No duplicate records are created for the same source URL across multiple runs
- [ ] Stored records are queryable from the Convex dashboard and via the frontend query

---

### Issue: Remove SQLite Seed Script and Dependencies

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Once the Playwright/LlamaIndex pipeline is verified end-to-end, remove the SQLite seed script (`backend/scripts/seed-from-sqlite.ts`) and any remaining SQLite dependencies from the project.

#### Acceptance Criteria

- [ ] `backend/scripts/seed-from-sqlite.ts` is deleted
- [ ] All SQLite-related packages are removed from `package.json`
- [ ] No SQLite references remain in the codebase (imports, config, scripts)
- [ ] The project builds and runs without errors after removal

---

### Issue: Implement Scraper Error Handling and Logging

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Add structured error handling throughout the scraping pipeline. Unreachable pages, skipped links, and pipeline errors should all be logged. The pipeline must continue processing remaining URLs when a single page fails.

#### Acceptance Criteria

- [ ] Unreachable pages (404, timeout, network error) are logged with the URL and failure reason
- [ ] Skipped links (filtered by LlamaIndex) are logged with the URL and relevance score
- [ ] A pipeline error on one URL does not halt processing of remaining URLs
- [ ] Each pipeline run produces a structured log with: start time, pages visited, records updated, errors, and skipped links

---

### Issue: Expose Manual Trigger for the Playwright Scraping Pipeline

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Expose a script or admin endpoint that allows a developer to manually trigger the Playwright scraping pipeline for testing purposes, without waiting for the scheduled run.

#### Acceptance Criteria

- [ ] A developer can trigger a full scraping run via a CLI script or an admin-only endpoint
- [ ] The trigger accepts at least one optional starting URL parameter for targeted testing
- [ ] The triggered run logs output to the console or a log file
- [ ] The trigger is documented in README.md or CLAUDE.md

---

### Issue: End-to-End Test of Playwright Scraping Pipeline

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Run the complete Playwright/LlamaIndex/Convex pipeline against live Hopkins CS pages. Verify that records are stored correctly in Convex and render on the results page.

#### Acceptance Criteria

- [ ] Pipeline runs end-to-end against at least 3 Hopkins CS lab pages without crashing
- [ ] Stored records contain the expected fields: lab name, professor(s), research focus, source URL, and timestamp
- [ ] Records are retrievable via the Convex query used by the results page
- [ ] Scraped records render correctly on the results page in the frontend
- [ ] Scraped data is embedded and vectorized in the Convex vector store

---

## R6 – Periodic Scraping & Data Freshness

---

### Issue: Implement Convex Scheduled Function for Monthly Scraping

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Implement a Convex scheduled function that invokes the Playwright scraping pipeline on a defined monthly interval. The scheduled job must not block or degrade the user-facing application during execution.

#### Acceptance Criteria

- [ ] A Convex scheduled function is defined and registered to run monthly
- [ ] The function invokes the full Playwright/LlamaIndex scraping pipeline
- [ ] The scheduled job runs in the background and does not block user-facing queries
- [ ] The next scheduled run time is visible in the Convex dashboard

---

### Issue: Add Structured Logging to Each Scheduled Scraping Run

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Add structured logging to each scheduled scraping run so that each execution is verifiable. Logs should capture enough information to confirm the run completed and identify any issues.

#### Acceptance Criteria

- [ ] Each run logs: start time, end time, pages visited, records added, records updated, and any errors
- [ ] Logs are accessible via the Convex dashboard or a designated log store
- [ ] A developer can confirm the last scheduled run completed by inspecting the logs

---

### Issue: Implement Stale Opportunity Removal

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

After each scheduled scraping run, remove Convex records for opportunities whose source URL was visited but produced no matching content. URLs that were unreachable due to network errors should not be deleted.

#### Acceptance Criteria

- [ ] After each run, the pipeline identifies records whose source URL was visited but returned no opportunity data
- [ ] Those records are deleted from Convex
- [ ] Records whose source URL was unreachable (network errors, timeouts) are not deleted
- [ ] Deleted records are logged with the source URL and reason for deletion
- [ ] The results page no longer shows deleted opportunities on the next load

---

### Issue: Test Periodic Scheduler and Stale Data Handling

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Manually trigger the scheduler and verify that logs are produced, new/changed opportunities are reflected on the results page, and stale records are removed.

#### Acceptance Criteria

- [ ] Scheduler can be manually triggered and completes without error
- [ ] Logs from the triggered run are present and contain expected fields
- [ ] A newly added or changed opportunity appears on the results page after the run
- [ ] A record whose source URL no longer contains relevant content is removed from Convex and disappears from the results page

---

## R7 – User Onboarding & Profile Creation

---

### Issue: Update Convex `users` Schema for Profile Fields

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Update the Convex `users` table schema to support the new profile fields required for onboarding. All schema changes must be documented in the PR description.

#### Acceptance Criteria

- [ ] `users` table includes: `profileComplete` (boolean), `courses` (array of strings), `researchPreferences` (string), `resumeEmbeddingId` (optional reference)
- [ ] Existing user records are not broken by the schema update
- [ ] Schema changes are documented in the PR description
- [ ] TypeScript types generated by Convex reflect the new schema

---

### Issue: Implement Post-Login Routing Logic for Onboarding

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

After login, check the authenticated user's `profileComplete` flag on their Convex record. Redirect new users (`profileComplete = false`) to `/onboard` and returning users to `/results`.

#### Acceptance Criteria

- [ ] Users with `profileComplete = false` are redirected to `/onboard` immediately after login
- [ ] Users with `profileComplete = true` are redirected to `/results` after login
- [ ] Navigating directly to `/onboard` as a returning user redirects to `/results`
- [ ] The `profileComplete` flag is set to `true` on first profile save

---

### Issue: Build Onboarding Screen UI

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Build the onboarding screen that new users see after first login. The screen must support resume (PDF) upload, optional course input, optional research preference input, and a review/edit step before saving.

#### Acceptance Criteria

- [ ] Onboarding screen is accessible at `/onboard` for authenticated new users
- [ ] User can upload a resume PDF; the file is accepted and passed to the extraction pipeline
- [ ] User can optionally enter courses taken and research focus preferences
- [ ] Extracted profile data is shown to the user for review and manual correction before saving
- [ ] User can skip optional fields and proceed
- [ ] The screen renders correctly on both desktop and mobile browsers

---

### Issue: Build Personal Profile Screen

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Build a personal profile screen, accessible post-onboarding, where users can view and edit all stored profile fields (resume, courses, research preferences).

#### Acceptance Criteria

- [ ] Profile screen is accessible at a defined route (e.g., `/profile`) for all authenticated users
- [ ] All stored profile fields are displayed: resume status, courses, and research preferences
- [ ] User can edit any field and save changes
- [ ] Changes are persisted to Convex and reflected immediately after save
- [ ] The screen renders correctly on both desktop and mobile browsers

---

### Issue: Implement Backend Mutation to Save and Update User Profile

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Implement the Convex mutation that saves or updates a user's profile data. The mutation must enforce redaction of sensitive personal information (home address, phone number, GPA) before persisting to the database.

#### Acceptance Criteria

- [ ] Mutation accepts and saves: `courses`, `researchPreferences`, `profileComplete`, and `resumeEmbeddingId`
- [ ] Sensitive fields (home address, phone number, GPA) are stripped before storage
- [ ] Re-calling the mutation with updated values overwrites the previous values (upsert behavior)
- [ ] Mutation is only callable by the authenticated user (no cross-user writes)

---

### Issue: Update Sidebar to Display Authenticated User's Profile Information

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Update the application sidebar to display the authenticated user's name and profile photo sourced from their Google account. This should be visible on all authenticated pages.

#### Acceptance Criteria

- [ ] Sidebar displays the authenticated user's full name from their Google account
- [ ] Sidebar displays the user's Google profile photo
- [ ] Information updates correctly if the user logs out and a different user logs in
- [ ] Sidebar renders correctly on both desktop and mobile browsers

---

### Issue: Test User Onboarding Flow and Profile Screen

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Test the complete onboarding flow for new users, the bypass for returning users, profile editing, sensitive field redaction, sidebar display, and mobile responsiveness.

#### Acceptance Criteria

- [ ] New user completing onboarding is redirected to `/results` after saving
- [ ] Returning user is not shown the onboarding screen
- [ ] Profile edits are saved and reflected on the profile screen
- [ ] Sensitive fields (address, phone, GPA) are not present in any Convex user record
- [ ] Sidebar shows correct name and photo for the authenticated user
- [ ] Onboarding and profile screens are usable on mobile browsers

---

## R8 – Resume Feature Extraction & Opportunity Matching

---

### Issue: Integrate LlamaIndex for Resume PDF Parsing

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Integrate LlamaIndex to parse an uploaded PDF resume and extract structured fields: projects, work experience, technical skills, soft skills, college grade level, and extracurricular activities. Sensitive fields (address, phone, GPA) must not be stored.

#### Acceptance Criteria

- [ ] LlamaIndex successfully parses an uploaded PDF resume
- [ ] The following fields are extracted: projects, work experience, technical skills, soft skills, college grade level, and extracurricular activities
- [ ] Sensitive fields (home address, phone number, GPA) are not extracted or stored
- [ ] Extraction works on at least 3 different resume formats/styles

---

### Issue: Chunk and Embed Extracted Resume Data into Convex Vector Store

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Use LlamaIndex to chunk the extracted resume data and generate embeddings using OpenAI `text-embedding-3-small`. Store the resulting vectors in the Convex vector store, associated with the user's record.

#### Acceptance Criteria

- [ ] Extracted resume data is chunked into consistent segments via LlamaIndex
- [ ] Each chunk is embedded using OpenAI `text-embedding-3-small`
- [ ] Embeddings are stored in the Convex vector store with the user's ID as metadata
- [ ] Re-uploading a resume replaces the previous embeddings (no orphaned vectors)

---

### Issue: Implement Opportunity Matching and Ranking Logic

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Implement the matching logic that scores and ranks research opportunities against a user's resume embeddings and stated preferences. Opportunities should be categorized as strong, moderate, or weak matches.

#### Acceptance Criteria

- [ ] Each opportunity is scored against the user's resume embeddings using vector similarity
- [ ] User-stated research preferences are factored into the ranking
- [ ] Opportunities are categorized as strong, moderate, or weak matches
- [ ] The ranking is deterministic for the same resume and opportunity set

---

### Issue: Build Convex Query for Ranked Opportunities

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Build a Convex query that returns opportunities ranked for the authenticated user, using their stored resume embeddings and preferences. The query should only be callable by authenticated users.

#### Acceptance Criteria

- [ ] Query accepts the authenticated user's ID and returns opportunities in ranked order
- [ ] Query is only callable by authenticated users
- [ ] Query returns unranked opportunities (with a flag) when no resume embeddings exist for the user
- [ ] Query response time is within acceptable limits for the results page load target (≤ 3 seconds for cached data)

---

### Issue: Update Results Page to Display Ranked Opportunities

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Update the results page to use the ranked opportunities query when a user profile with resume embeddings exists. Show an unranked fallback with a prompt to complete the profile when no resume has been uploaded.

#### Acceptance Criteria

- [ ] Results page shows ranked opportunities for users with resume embeddings
- [ ] Results page shows unranked opportunities for users without a resume, alongside a prompt to complete their profile
- [ ] The match category (strong / moderate / weak) is visible on each opportunity card
- [ ] Page transitions between ranked and unranked states correctly when a resume is added

---

### Issue: Test Resume Extraction, Embedding, and Opportunity Matching

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Run end-to-end tests covering resume upload and extraction, embedding storage, ranked results accuracy, and the fallback state for users without a profile.

#### Acceptance Criteria

- [ ] Resume upload triggers extraction and produces correctly structured fields
- [ ] Embeddings are stored in Convex and associated with the correct user
- [ ] Ranked results on the results page reflect the resume content (manually verified against a known resume)
- [ ] Users without a resume see the unranked fallback and profile prompt
- [ ] Sensitive fields are absent from all stored records

---

## R9 – UI/UX Improvements

---

### Issue: Update Application Color Scheme

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Replace the current purple color palette with the team's agreed-upon new palette. Apply the update consistently across all pages and components.

#### Acceptance Criteria

- [ ] All instances of the purple primary color are replaced with the new palette
- [ ] Color is applied consistently across all pages (landing, results, onboarding, profile)
- [ ] No purple remnants remain in Tailwind config, CSS variables, or component classes
- [ ] Changes render correctly on both desktop and mobile browsers

---

### Issue: Redesign Landing Page with Two-Panel Layout

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Redesign the landing page with a two-panel layout: login/signup controls on the left panel, and an overview of the application (description, key features) on the right panel. On mobile, the panels stack vertically.

#### Acceptance Criteria

- [ ] Landing page has a two-panel layout on desktop: login/signup on the left, app overview on the right
- [ ] App overview panel includes a brief description of Lighthouse and its key features
- [ ] On mobile, the panels stack vertically (app overview below login/signup or vice versa — team to decide)
- [ ] Login/signup controls are fully functional on the redesigned page
- [ ] Page renders correctly on both desktop and mobile browsers

---

### Issue: Implement Logout Button

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Add a logout button accessible from all authenticated pages. Clicking it should end the user's session and redirect them to the login page.

#### Acceptance Criteria

- [ ] A logout button is visible on all authenticated pages (e.g., in the sidebar or navbar)
- [ ] Clicking logout ends the Convex session and clears any local auth state
- [ ] After logout, the user is redirected to the login page
- [ ] Navigating back after logout does not restore the session (user must re-authenticate)

---

### Issue: Implement Pagination on the Results Page

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Add pagination to the results page so users can navigate between pages of opportunities rather than scrolling through one long list. Page size should be agreed upon by the team before implementation.

#### Acceptance Criteria

- [ ] Results page displays a fixed number of opportunities per page (team-agreed page size)
- [ ] Pagination controls (previous / next, and/or page numbers) are visible and functional
- [ ] Navigating to a page shows the correct subset of results
- [ ] Pagination works correctly for both ranked and unranked result sets
- [ ] Pagination controls render correctly on mobile browsers

---

### Issue: Implement Text Truncation with "Show More" Toggle on Opportunity Cards

**Label:** `feature`
**Milestone:** Iteration 2

---

#### Description

Truncate long lab descriptions on opportunity cards at a defined character limit. Display a "Show more" toggle that expands the full text inline without navigating away from the page.

#### Acceptance Criteria

- [ ] Lab descriptions exceeding the character limit are truncated with a trailing ellipsis
- [ ] A "Show more" button appears below truncated descriptions
- [ ] Clicking "Show more" expands the full description inline
- [ ] A "Show less" button collapses the description back to the truncated state
- [ ] Descriptions shorter than the limit are displayed in full with no toggle

---

### Issue: Improve Opportunity Card Layout for Researcher Info and Research Focus

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Improve the opportunity card layout for the researcher information and research focus fields. When values are present, they should be displayed in a consistent, readable layout. When values are missing, show a styled placeholder instead of blank space or an awkward gap.

#### Acceptance Criteria

- [ ] Researcher information and research focus are displayed in a consistent layout when values are present
- [ ] When either field is missing, a styled "Not specified" placeholder is shown (e.g., a muted badge)
- [ ] No blank space or layout shift occurs when fields are absent
- [ ] Card layout is consistent across all opportunity cards regardless of which fields are populated

---

### Issue: Test UI/UX Improvements

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Test all R9 UI/UX changes: color consistency, landing page layout, logout flow, pagination, truncation toggle, and missing-field placeholders across desktop and mobile.

#### Acceptance Criteria

- [ ] New color palette is applied consistently with no purple remnants
- [ ] Landing page two-panel layout renders correctly on desktop and stacks correctly on mobile
- [ ] Logout clears session and redirects to login
- [ ] Pagination navigates correctly between pages for both ranked and unranked results
- [ ] "Show more" / "Show less" toggle works correctly on truncated descriptions
- [ ] Opportunity cards with missing researcher info or research focus show styled placeholders

---

## R10 – Performance Audit

---

### Issue: Conduct External Performance and Vulnerability Audit

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

The external reviewer interacts with the running application and inspects the codebase to identify vulnerabilities, usability issues, bugs, and performance bottlenecks. The reviewer exercises all core user flows including login, onboarding, scraping, opportunity browsing, and resume upload/matching.

#### Acceptance Criteria

- [ ] Reviewer exercises all core user flows end-to-end
- [ ] Reviewer inspects codebase for security vulnerabilities, code quality issues, and performance concerns
- [ ] All findings are captured and handed off to the team for documentation

---

### Issue: Document Audit Findings

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Compile a written audit summary documenting all findings from the external review. Each finding must include: issue description, severity (critical / high / medium / low), category (vulnerability / usability / bug / performance), and recommended fix.

#### Acceptance Criteria

- [ ] Audit summary is written and accessible to the team (PR description, shared doc, or committed file)
- [ ] Each finding lists: description, severity, category, and recommended fix
- [ ] All critical and high-severity findings are flagged for resolution by the next iteration
- [ ] All medium and low-severity findings are listed

---

### Issue: Resolve Critical and High-Severity Audit Findings

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

Resolve all critical and high-severity findings identified in the external audit before the iteration closes.

#### Acceptance Criteria

- [ ] All critical and high-severity findings from the audit are resolved
- [ ] Fixes are verified by re-testing the specific scenario
- [ ] No new critical or high-severity issues are introduced by the fixes

---

### Issue: Log Medium and Low-Severity Audit Findings as GitHub Issues

**Label:** `task`
**Milestone:** Iteration 2

---

#### Description

For each medium and low-severity finding from the external audit that is not resolved this iteration, create a GitHub issue so it is tracked for a future iteration.

#### Acceptance Criteria

- [ ] Each medium and low-severity finding has a corresponding GitHub issue
- [ ] Each issue includes the finding description, severity, category, and recommended fix from the audit summary
- [ ] Issues are labeled appropriately (`bug` or `task`) and added to a future milestone

---
