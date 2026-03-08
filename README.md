# Lighthouse

## Project Description

Lighthouse is a full-stack app that centralizes Johns Hopkins research opportunities.
It uses Convex + Next.js and Google authentication to let students browse and match with lab opportunities.

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [GitHub CLI (`gh`)](https://cli.github.com/) - used for issue, label, milestone, and PR management
- [Node.js](https://nodejs.org/) (LTS recommended)

## Setup

```bash
# Clone the repository
git clone https://github.com/cs423sp26-homeworks/team-03.git
cd team-03

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

Create environment files:

`frontend/.env`
```env
NEXT_PUBLIC_CONVEX_URL=https://<your-convex-deployment>.convex.cloud
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
```

`backend/.env.local`
```env
CONVEX_DEPLOYMENT=<dev-or-prod>:<your-convex-deployment>
CONVEX_URL=https://<your-convex-deployment>.convex.cloud
CONVEX_SITE_URL=https://<your-convex-deployment>.convex.site
AUTH_GOOGLE_ID=<your-google-client-id>
AUTH_GOOGLE_SECRET=<your-google-client-secret>
```

Start services:

```bash
# Terminal 1: backend (Convex)
cd backend
npx convex dev

# Terminal 2: frontend (Next.js)
cd frontend
npm run dev
```

## Running the Application

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

## Running Tests

```bash
# Frontend tests
cd frontend
npm test -- --run

# Backend tests
cd ../backend
npm test -- --run
```

## Seeding Production

> Run once when new scraped data needs to be added to the shared production Convex deployment.

1. From the `backend/` directory, deploy the latest backend code to production:
   ```bash
   npm run deploy
   ```
   When prompted "Do you want to push to prod deployment?" type `y`.

2. Run the seed script targeting the production deployment:
   ```bash
   CONVEX_URL=https://reliable-swan-607.convex.cloud npm run seed
   ```

3. Verify in the [Convex dashboard](https://dashboard.convex.dev) that the `opportunities` table has 28 rows.

---

## Seeding a Local Database

> Run once after cloning the repo or when your local dev deployment is empty.

1. From the `backend/` directory, start the dev server to sync your local Convex deployment:
   ```bash
   npm run dev
   ```

2. Run the seed script targeting your local deployment (find your URL in `backend/.env.local`):
   ```bash
   CONVEX_URL=https://<your-local-deployment>.convex.cloud npm run seed
   ```

3. Start the frontend - the Results page should now show live data:
   ```bash
   cd ../frontend && npm run dev
   ```

## Documentation

- Iteration plans: `docs/iteration-x-plan.md`
- Product Requirements Document: `docs/product-requirements.md`
- Team Information: `docs/team-agreement.md`
