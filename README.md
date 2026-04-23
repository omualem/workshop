# RentMatch

A Hebrew-first equipment rental marketplace with a Smart Bundle Ranking Engine.
Users search for multiple items at once and get ranked bundle combinations from multiple lenders, with transparent scoring across price, reliability, logistics, availability, and quality.

---

## Prerequisites

Install these before anything else.

### 1. Node.js (v18 or later)

Download from https://nodejs.org and run the installer.

Verify:
```
node --version
npm --version
```

Both commands should print a version number. If they don't, restart your terminal after installing.

### 2. Git

Download from https://git-scm.com if you don't have it.

Verify:
```
git --version
```

That's it. No Docker, no PostgreSQL, no Redis required for local development.

---

## First-time setup

Run these once after cloning the repo.

**1. Install dependencies**
```
npm install
```

**2. Create environment files and seed the database**
```
npm run setup:local
```

This creates the `.env` files, applies the database migration, and fills the local SQLite database with demo data. It takes about a minute the first time.

---

## Running the project

### Option A — PowerShell script (recommended on Windows)

```powershell
.\dev.ps1
```

This script automatically kills anything already running on ports 3000 or 4000, then starts both servers.

### Option B — npm command

```
npm run dev
```

Starts both servers at the same time using `concurrently`.

---

After either option, open your browser at:

| App | URL |
|-----|-----|
| Website (public) | http://localhost:3000 |
| Search & catalog | http://localhost:3000/search |
| Bundle request | http://localhost:3000/bundle-request |
| Renter dashboard | http://localhost:3000/renter/dashboard |
| Lender dashboard | http://localhost:3000/lender/dashboard |
| Admin dashboard | http://localhost:3000/admin/dashboard |
| API | http://localhost:4000 |

---

## Database commands

| What | Command |
|------|---------|
| Reset DB and reseed from scratch | `npm run db:reset` |
| Reseed without resetting | `npm run db:seed` |
| Apply new migrations | `npm run db:migrate` |
| Regenerate Prisma client | `npm run db:generate` |

---

## Other useful commands

| What | Command |
|------|---------|
| Run API tests | `npm test -w apps/api` |
| Typecheck API | `npm run lint -w apps/api` |
| Typecheck web | `npx tsc --noEmit -p apps/web/tsconfig.json` |
| Build everything | `npm run build` |
