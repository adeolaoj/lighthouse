# Project Configuration

## Project Description

Lighthouse is a full-stack AI-powered web application that centralizes research opportunities across Johns Hopkins University. It scrapes Hopkins CS and LCSR lab websites, embeds and stores opportunity data, and matches opportunities to students based on resumes, interests, and academic background.


## Tech Stack

Frontend:
- TypeScript
- React
- TailwindCSS

Backend:
- TypeScript
- Convex
- Vercel AI SDK

Authentication:
- Google OAuth 2.0

AI Services:
- OpenAI API
- Claude API

External Tools:
- Puppeteer with Chrome MCP (browser automation)

Deployment:
- Vercel or AWS

Testing:
- Vitest

## Commands

Frontend (`cd frontend`):
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Run tests: `npm run test`
- Run linter: `npm run lint`
- Build for production: `npm run build`
- Type check: `npm run typecheck`

Backend (`cd backend`):
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Deploy to Convex cloud: `npm run deploy`
- Type check: `npm run typecheck`

## Code Style
- Formatting: Prettier
- Linting: ESLint
- TypeScript strict mode enabled
- Naming conventions:
  - camelCase for variables and functions
  - PascalCase for React components
  - No default exports unless required

## Architecture

Status: Architecture and file structure are not yet implemented.

### Architecture Goals (what we are building toward)
- Google OAuth login
- Web scraping workflow to collect CS + LCSR research opportunity data
- Chunking + embedding pipeline that stores scraped opportunities in a database
- Results page to display scraped opportunities (Iteration 1)
- Periodic scraping to keep data up to date (Iteration 1)

### Initial Repo Scaffolding Plan (what to build first)
1. Create frontend app skeleton (React + Tailwind)
   - Landing/login page
   - Results page UI scaffold (static placeholder data first)
2. Create backend skeleton (Convex + Vercel AI SDK)
   - Basic API endpoints / functions for:
     - triggering scrape
     - storing opportunities
     - retrieving opportunities for results page
3. Add auth integration (Google OAuth)
4. Add scraping pipeline (Puppeteer/Chrome MCP) + storage
5. Add embedding pipeline (chunk + embed + persist)

### Claude Working Rules (until architecture is stable)
- Always propose a plan before creating folders/files.
- For any new folder structure, provide a short rationale.
- Prefer small PRs (one slice of scaffolding at a time).
- Do not introduce new libraries without explaining why and confirming.
- Never commit secrets (OAuth creds, API keys). Use env vars + .env.example.
- Do not store sensitive resume data (address, phone, GPA, personal email).
- When changing types/schemas (Convex tables, opportunity fields), document the schema in the PR description.
- After edits, run the relevant checks (dev server, tests/lint if available) and summarize results.

### Scaffolding “Definition of Done” (Iteration 1 foundation)
- Repo can run locally with a single documented setup flow.
- Frontend loads a basic UI with a Results page using placeholder data.
- Backend can be started locally and exposes a minimal function/API to return opportunities.
- Auth flow is wired (even if results are still placeholder).
- No secrets committed; .env.example exists.

## Branch & Commit Conventions

- Branch pattern: `<author>/<type>/issue-<number>-<short-description>`
  - `type` must match the issue label: `feature`, `bug`, or `task`
- Never push directly to master
- Reference issues in commits: `Add file validation (#12)`
- Keep PRs under ~400 changed lines
- Use merge commits (no squash or rebase)

## Common Mistakes

- [ ] Forgetting to reference the issue number in commits
- [ ] Pushing directly to master instead of creating a PR
- [ ] Creating issues for future iterations instead of the current one
- [ ] Modifying OAuth configuration without team discussion
- [ ] Persisting sensitive resume data (address, GPA, phone number)
- [ ] Running scraper workflows without confirming rate limits
- [ ] Making large multi-file edits without proposing a plan first
