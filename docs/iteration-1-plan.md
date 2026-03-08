# Iteration 1 Plan

## Requirements & Acceptance Criteria

<!--

List each requirement with clear, testable acceptance criteria

### Requirement Number and Title

**Description:** What needs to be built

- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2

-->

### R1 – Results Page (View Scraped Opportunities):

**Description:** Users can view research opportunities scraped from Hopkins' CS and LCSR department websites. Each opportunity displays relevant lab details: professors, required background, and research focus.

- **Acceptance Criteria:**
  - [ ] Authenticated users can navigate to a results page that displays a list of scraped research opportunities.
  - [ ] Each opportunity card/entry shows at minimum: lab/project name, associated professor(s), research focus/description, and required background.
  - [ ] If a field is unavailable from the source, it is displayed as "Not specified" rather than blank or crashing.
  - [ ] The page renders correctly on both desktop and mobile browsers.
  - [ ] If no opportunities are in the database, the page displays a clear empty state message (e.g., "No opportunities found. Check back soon.").
  - [ ] The page loads within 3 seconds when data is already in the database.
Unauthenticated users are redirected to the login page if they attempt to access the results page.



### R2 – AI-Powered Web Scraping Pipeline:
**Description:** An AI system scrapes Hopkins CS and LCSR websites, then chunks, embeds, and stores the extracted data in a database.

- **Acceptance Criteria:**
  - [ ] The scraper successfully visits all in-scope Hopkins CS and LCSR URLs and extracts opportunity-related content.
  - [ ] Extracted content is chunked into segments of a defined, consistent size (team must agree on chunk size).
  - [ ] Each chunk is embedded using the chosen embedding model and stored in the vector database with metadata (source URL, lab name, professor, timestamp).
  - [ ] Duplicate entries from the same source URL are not created on re-run; existing records are updated instead.
  - [ ] If a page is unreachable (404, timeout, etc.), the pipeline logs the failure and continues without crashing.
  - [ ] Stored data can be queried and returned to the results page correctly.
  - [ ] A developer can manually trigger the scrape pipeline (e.g., via a script or admin endpoint) for testing.


### R3 – Periodic Scraping / Data Freshness:

**Description:** A scheduled process monthly re-runs the web scrape to keep opportunity data up to date. Stale opportunities are removed when this process occurs

- **Acceptance Criteria:**
  - [ ] A scheduled job runs the scraping pipeline at a defined, agreed-upon interval (e.g., weekly).
  - [ ] The scheduler can be verified as running via logs or a monitoring mechanism.
  - [ ] After a scheduled run completes, newly added or changed opportunities are reflected in the results page on next load.
  - [ ] Opportunities from source pages that no longer exist are either removed or flagged as stale (behavior must be decided and consistently applied).
  - [ ] The scheduled job does not block or degrade the user-facing application during execution.


### R4 – Google OAuth Login:

**Description:** Users can authenticate via Google OAuth before accessing the application.

- **Acceptance Criteria:**
  - [ ] Users can click "Sign in with Google" and are redirected to Google's OAuth consent screen.
  - [ ] After successful authentication, users are redirected back to the application and land on a defined page (e.g., results page).
  - [ ] A user session is created and persisted appropriately (user does not need to re-authenticate on page refresh within session).
  - [ ] If authentication fails or is cancelled, the user is returned to the login page with a clear error or status message.
  - [ ] Only valid Google accounts can authenticate; no anonymous access to protected pages is permitted.
  - [ ] User identity (name, email) is stored minimally — only what is needed for the session and future profile features.


## Coordination & Design Decisions

<!--

Document key design decisions the team has made
Include: architecture choices, API contracts, shared interfaces,
who is responsible for what, and any dependencies between tasks

-->
### Key Design Considerations:
* For R1: Relevant lab details that users should see include: lab description, link to the lab, lab head researcher/professor/faculty, opportunity type (paid/unpaid), and who the lab is looking for
* The embedding model we will be using is Convex
* Web scraping will occur monthly and stale opportunities will be removed
* The Dashboard page is the post-login screen
* If the user is a new user, it will take them to the profile setup screen

### Task Dependencies:
|            Task            |                          Depends On                          |
|:--------------------------:|:------------------------------------------------------------:|
| Login page UI              | OAuth backend flow configured                                |
| Route guards               | Session management implemented                               |
| Scraper (crawling)         | Seed URL list finalized; Puppeteer environment set up        |
| Embedding + storage        | Embedding model chosen; vector DB schema defined             |
| Results page data fetch    | Database schema finalized; at least one scrape run completed |
| Results page UI            | Backend query/API contract defined                           |
| Periodic scheduler         | Scraping pipeline fully functional end-to-end                |
| Stale opportunity handling | Scheduler implemented; retention policy decided              |


## Task Breakdown

### R1 – Results Page

- Task: R1 - Results Page (epic)
  - Issue: #1
  - Type: task
  - Status: CLOSED

- Task: Define the data schema/API contract for opportunity records returned to the frontend.
  - Issue: #8
  - Type: task
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Implement a backend query/endpoint that fetches opportunity records from the database.
  - Issue: #11
  - Type: feature
  - Assignee(s): @Alysha
  - Status: CLOSED

- Task: Build the Results Page UI.
  - Issue: #13
  - Type: feature
  - Assignee(s): @Adeola
  - Status: CLOSED

- Task: Set up route protection middleware and authentication guard logic to secure the Results Page endpoint.
  - Issue: #16
  - Type: feature
  - Assignee(s): @Alysha
  - Status: CLOSED

- Task: Build the Opportunity Card component — renders lab name, professor(s), research focus, required background.
  - Issue: #18
  - Type: feature
  - Assignee(s): @Adeola
  - Status: CLOSED

- Task: Handle missing fields gracefully — display "Not specified" for any absent metadata.
  - Issue: #21
  - Type: task
  - Status: CLOSED

- Task: Implement the empty state UI for when no opportunities are in the database.
  - Issue: #25
  - Type: feature
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Connect the results page to the backend query and render live data.
  - Issue: #26
  - Type: task
  - Assignee(s): @Nikay, @Ryan
  - Status: CLOSED

- Task: Test: page load with data, empty state, missing field handling, mobile responsiveness, unauthenticated access redirect.
  - Issue: #28
  - Type: task
  - Assignee(s): @Alysha, @Nikay
  - Status: CLOSED

- Task: Remove redundant id and postedAt fields.
  - Issue: #74
  - Type: bug
  - Status: CLOSED

- Task: Fix post-login redirect.
  - Issue: #81
  - Type: bug
  - Status: CLOSED

- Task: Correct Convex Schema.
  - Issue: #82
  - Type: task
  - Status: CLOSED

- Task: Fix get_opportunities.
  - Issue: #84
  - Type: task
  - Status: CLOSED

- Task: Display data from Convex on results page.
  - Issue: #87
  - Type: task
  - Status: CLOSED

- Task: Deploy R1 Results Page and R2 Google Auth to Vercel.
  - Issue: #91
  - Type: task
  - Status: CLOSED

- Task: Prepare Code for Deployment.
  - Issue: #100
  - Type: task
  - Status: CLOSED

- Task: Fix Numbered Features.
  - Issue: #101
  - Type: bug
  - Status: CLOSED

- Task: Correct OpportunityCard component behavior.
  - Issue: #103
  - Type: bug
  - Status: CLOSED

- Task: Update Opportunities Schema.
  - Issue: #108
  - Type: task
  - Status: CLOSED

- Task: Fix useSearchParams() null safety on login and signup pages.
  - Issue: #110
  - Type: bug
  - Status: CLOSED

- Task: Sign Up and Sign In buttons bypass authentication.
  - Issue: #114
  - Type: bug
  - Status: CLOSED

---

### R2 – AI-Powered Scraping Pipeline

- Task: R2 – AI-Powered Scraping Pipeline (epic)
  - Issue: #2
  - Type: task
  - Status: CLOSED

- Task: Define and document the list of seed URLs for Hopkins CS and LCSR websites.
  - Issue: #5
  - Type: task
  - Assignee(s): @all
  - Status: CLOSED

- Task: Set up Puppeteer/Chrome MCP environment and verify it can load target pages.
  - Issue: #7
  - Type: task
  - Assignee(s): @Ariel, @Adeola
  - Status: CLOSED

- Task: Set up Puppeteer.
  - Issue: #50
  - Type: task
  - Assignee(s): @Ariel, @Adeola
  - Status: CLOSED

- Task: Implement the crawler: visit seed URLs, follow relevant internal links, and extract raw page text/HTML.
  - Issue: #9
  - Type: feature
  - Assignee(s): @Ariel
  - Status: CLOSED

- Task: Implement extraction of relevant links.
  - Issue: #49
  - Type: feature
  - Assignee(s): @Ariel
  - Status: CLOSED

- Task: Web-crawl into more layers.
  - Issue: #56
  - Type: task
  - Status: CLOSED

- Task: Try the same web-crawling logic but use playwright.
  - Issue: #93
  - Type: task
  - Status: CLOSED

- Task: Combine the lab URLs under the same lab domain.
  - Issue: #120
  - Type: task
  - Status: CLOSED

- Task: Implement chunking logic — split raw content into consistent segments with defined overlap.
  - Issue: #10
  - Type: feature
  - Assignee(s): @Adeola, @Ryan, @Ariel
  - Status: CLOSED

- Task: Implement web-scraped data chunking logic.
  - Issue: #32
  - Type: task
  - Assignee(s): @Adeola, @Ryan, @Ariel
  - Status: CLOSED

- Task: Integrate the chosen embedding model (CLOSEDAI or Claude API) to generate embeddings per chunk.
  - Issue: #33
  - Type: feature
  - Assignee(s): @Ariel, @Ryan
  - Status: CLOSED

- Task: Set up the vector database and define the data schema.
  - Issue: #34
  - Type: task
  - Assignee(s): @Alysha, @Nikay
  - Status: CLOSED

- Task: Design the schema.
  - Issue: #41
  - Type: task
  - Status: CLOSED

- Task: Setup a Node Project.
  - Issue: #42
  - Type: task
  - Status: CLOSED

- Task: Implement storage logic — write chunks + embeddings + metadata to the database; handle upsert to avoid duplicates.
  - Issue: #36
  - Type: feature
  - Assignee(s): @Alysha
  - Status: CLOSED

- Task: Implement error handling — log unreachable pages, continue pipeline on failure.
  - Issue: #37
  - Type: task
  - Assignee(s): @Ryan
  - Status: CLOSED

- Task: Expose a manual trigger endpoint or script for developer testing.
  - Issue: #38
  - Type: task
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Test: run pipeline end-to-end against at least 3 real Hopkins pages, verify stored records are correct and queryable.
  - Issue: #40
  - Type: task
  - Assignee(s): @Ariel, @Adeola, @Ryan
  - Status: CLOSED

- Task: Create an evaluation loop that checks whether the web-scraped data is sufficient.
  - Issue: #31
  - Type: task
  - Assignee(s): @Ariel
  - Status: CLOSED

---

### R3 – Periodic Scraping / Data Freshness

- Task: R4 - Periodic Scraping / Data Freshness (epic)
  - Issue: #4
  - Type: task
  - Status: CLOSED

- Task: Decide and document the scraping interval.
  - Issue: #14
  - Type: task
  - Assignee(s): @all
  - Status: CLOSED

- Task: Implement a scheduler to invoke the scraping pipeline at the defined interval.
  - Issue: #17
  - Type: feature
  - Assignee(s): @Ariel, @Adeola
  - Status: CLOSED

- Task: Implement stale/removed opportunity handling logic (delete, archive, or flag — team decision required).
  - Issue: #19
  - Type: feature
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Add logging so each scheduled run is verifiable (start time, pages visited, records updated, errors).
  - Issue: #22
  - Type: task
  - Assignee(s): @Ariel
  - Status: CLOSED

- Task: Test: manually trigger the scheduler, verify logs, verify data updates appear on results page.
  - Issue: #23
  - Type: task
  - Assignee(s): @Ariel, @Adeola
  - Status: CLOSED

---

### R4 – Google OAuth Login

- Task: R3 - Google OAuth Login (epic)
  - Issue: #3
  - Type: task
  - Status: CLOSED

- Task: Configure Google OAuth 2.0 credentials in Google Cloud Console and store keys securely in environment variables.
  - Issue: #15
  - Type: task
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Set Up Google OAuth 2.0 Authentication.
  - Issue: #6
  - Type: feature
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Implement OAuth login flow in the backend using Convex auth or a compatible middleware.
  - Issue: #12
  - Type: feature
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Build the login page UI with a "Sign in with Google" button.
  - Issue: #20
  - Type: feature
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Build Login Page UI.
  - Issue: #24
  - Type: feature
  - Assignee(s): @Nikay
  - Status: CLOSED

- Task: Implement session management (store and validate user session; handle token refresh).
  - Issue: #27
  - Type: feature
  - Assignee(s): @Ryan
  - Status: CLOSED

- Task: Implement route guards — redirect unauthenticated users to login page.
  - Issue: #29
  - Type: feature
  - Assignee(s): @Ryan
  - Status: CLOSED

- Task: Test: successful login, cancelled login, session persistence, and unauthorized route access.
  - Issue: #30
  - Type: task
  - Assignee(s): @Nikay, @Ryan
  - Status: CLOSED

---

### General / Cross-Cutting

- Task: Create an Iteration plan for Iteration 1.
  - Issue: #35
  - Type: task
  - Status: CLOSED

- Task: Update Claude.md and README.md.
  - Issue: #44
  - Type: task
  - Status: CLOSED

- Task: Update .gitignore.
  - Issue: #52
  - Type: task
  - Status: CLOSED

- Task: Formatting Errors Within Iteration-1-Plan.md.
  - Issue: #60
  - Type: bug
  - Status: CLOSED

- Task: Upload Team Agreement.
  - Issue: #63
  - Type: task
  - Status: CLOSED

- Task: Upload Project Roadmap.
  - Issue: #64
  - Type: task
  - Status: CLOSED

- Task: Upload Product Requirements Documents.
  - Issue: #65
  - Type: task
  - Status: CLOSED

- Task: Combine Features 1 and Features 3 into Dev.
  - Issue: #97
  - Type: task
  - Status: CLOSED

- Task: Update Documents.
  - Issue: #138
  - Type: task
  - Status: CLOSED