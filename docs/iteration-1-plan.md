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

<!--

Break requirements into GitHub issues. Update this section with the tasks for the current iteration.

Example format:

- Task: ...
  - Type: feature/task/bug
  - Assignee(s): @name(s)
  - Requirement Number: #N

-->

### R4 – Google OAuth Login

- Task: Configure Google OAuth 2.0 credentials in Google Cloud Console and store keys securely in environment variables.
  - Type: task
  - Assignee(s): @Nikay
  - Requirement Number: #R4

- Task: Implement OAuth login flow in the backend using Convex auth or a compatible middleware.
  - Type: feature
  - Assignee(s): @Nikay
  - Requirement Number: #R4

- Task: Build the login page UI with a "Sign in with Google" button.
  - Type: feature
  - Assignee(s): @Nikay
  - Requirement Number: #R4

- Task: Implement session management (store and validate user session; handle token refresh).
  - Type: feature
  - Assignee(s): @Ryan
  - Requirement Number: #R4

- Task: Implement route guards — redirect unauthenticated users to login page.
  - Type: feature
  - Assignee(s): @Ryan
  - Requirement Number: #R4

- Task: Test: successful login, cancelled login, session persistence, and unauthorized route access.
  - Type: task
  - Assignee(s): @Nikay, @Ryan
  - Requirement Number: #R4

---

### R2 – AI-Powered Scraping Pipeline

- Task: Define and document the list of seed URLs for Hopkins CS and LCSR websites.
  - Type: task
  - Assignee(s): @all
  - Requirement Number: #R2

- Task: Set up Puppeteer/Chrome MCP environment and verify it can load target pages.
  - Type: task
  - Assignee(s): @Ariel, @Adeola
  - Requirement Number: #R2

- Task: Implement the crawler: visit seed URLs, follow relevant internal links, and extract raw page text/HTML.
  - Type: feature
  - Assignee(s): @Ariel
  - Requirement Number: #R2

- Task: Implement chunking logic — split raw content into consistent segments with defined overlap.
  - Type: feature
  - Assignee(s): @Adeola, @Ryan, @Ariel
  - Requirement Number: #R2

- Task: Integrate the chosen embedding model (OpenAI or Claude API) to generate embeddings per chunk.
  - Type: feature
  - Assignee(s): @Ariel, @Ryan
  - Requirement Number: #R2

- Task: Set up the vector database and define the data schema.
  - Type: task
  - Assignee(s): @Alysha, @Nikay
  - Requirement Number: #R2

- Task: Implement storage logic — write chunks + embeddings + metadata to the database; handle upsert to avoid duplicates.
  - Type: feature
  - Assignee(s): @Alysha
  - Requirement Number: #R2

- Task: Implement error handling — log unreachable pages, continue pipeline on failure.
  - Type: task
  - Assignee(s): @Ryan
  - Requirement Number: #R2

- Task: Expose a manual trigger endpoint or script for developer testing.
  - Type: task
  - Assignee(s): @Nikay
  - Requirement Number: #R2

- Task: Test: run pipeline end-to-end against at least 3 real Hopkins pages, verify stored records are correct and queryable.
  - Type: task
  - Assignee(s): @Ariel, @Adeola, @Ryan
  - Requirement Number: #R2

- Task: Create an evaluation loop that checks whether the web-scaped data is sufficient (whether there’s need to navigate to more urls, or if the web-scape collect enough details about a lab)
  - Type: task
  - Assignee(s): @Ariel
  - Requirement Number: #R2

---

### R1 – Results Page

- Task: Define the data schema/API contract for opportunity records returned to the frontend.
  - Type: task
  - Assignee(s): @Nikay
  - Requirement Number: #R1

- Task: Implement a backend query/endpoint that fetches opportunity records from the database.
  - Type: feature
  - Assignee(s): @Alysha
  - Requirement Number: #R1

- Task: Build the Results Page UI.
  - Type: feature
  - Assignee(s): @Adeola
  - Requirement Number: #R1

- Task: Set up route protection middleware and authentication guard logic to secure the Results Page endpoint.
  - Type: feature
  - Assignee(s): @Alysha
  - Requirement Number: #R1

- Task: Build the Opportunity Card component — renders lab name, professor(s), research focus, required background.
  - Type: feature
  - Assignee(s): @Adeola
  - Requirement Number: #R1

- Task: Handle missing fields gracefully — display "Not specified" for any absent metadata.
  - Type: task
  - Assignee(s): TBD
  - Requirement Number: #R1

- Task: Implement the empty state UI for when no opportunities are in the database.
  - Type: feature
  - Assignee(s): @Nikay
  - Requirement Number: #R1

- Task: Connect the results page to the backend query and render live data.
  - Type: task
  - Assignee(s): @Nikay, @Ryan
  - Requirement Number: #R1

- Task: Test: page load with data, empty state, missing field handling, mobile responsiveness, unauthenticated access redirect.
  - Type: task
  - Assignee(s): @Alysha, @Nikay
  - Requirement Number: #R1

---

### R3 – Periodic Scraping / Data Freshness

- Task: Decide and document the scraping interval.
  - Type: task
  - Assignee(s): @all
  - Requirement Number: #R3

- Task: Implement a scheduler to invoke the scraping pipeline at the defined interval.
  - Type: feature
  - Assignee(s): @Ariel, @Adeola
  - Requirement Number: #R3

- Task: Implement stale/removed opportunity handling logic (delete, archive, or flag — team decision required).
  - Type: feature
  - Assignee(s): @Nikay
  - Requirement Number: #R3

- Task: Add logging so each scheduled run is verifiable (start time, pages visited, records updated, errors).
  - Type: task
  - Assignee(s): @Ariel
  - Requirement Number: #R3

- Task: Test: manually trigger the scheduler, verify logs, verify data updates appear on results page.
  - Type: task
  - Assignee(s): @Ariel, @Adeola
  - Requirement Number: #R3
