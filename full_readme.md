# RentMatch Full README

## What This Project Is

RentMatch is a monorepo for a Hebrew-first rental marketplace focused on building and ranking equipment bundles. Instead of searching for one item at a time, a renter can describe a multi-item need, set a budget and pickup constraints, and get ranked bundle combinations from multiple lenders.

The product has three main faces:

- Public marketplace and search experience
- Lender and renter dashboards
- Admin management tools

The core differentiator is the bundle optimizer in the backend. It filters candidate listings, builds bundle combinations, scores them across several metrics, and returns explanations for why the best bundles ranked highest.

## Current Tech Stack

- Monorepo: npm workspaces
- Frontend: Next.js 15, React 19, App Router, Tailwind CSS, TanStack Query
- Backend: NestJS 11, TypeScript
- Database: Prisma with SQLite for local development
- Cache: Redis when configured, in-memory fallback when not configured
- Validation: class-validator plus Zod for the optimizer request

## Monorepo Layout

```text
.
|-- apps/
|   |-- api/          NestJS backend + Prisma schema + seeds/importers
|   `-- web/          Next.js frontend
|-- packages/
|   |-- config/       shared feature flags and locale config
|   |-- types/        shared TS types
|   |-- ui/           shared React UI primitives/components
|   `-- utils/        shared helper functions
|-- scripts/          repo-level setup/reset helpers
|-- design/           design assets / working files
|-- logos/            logo assets
|-- docker-compose.yml
|-- dev.ps1
|-- dev.sh
|-- README.md
`-- full_readme.md
```

## How The Project Runs

### High-level runtime model

1. The Next.js app runs on `http://localhost:3000`.
2. The NestJS API runs on `http://localhost:4000`.
3. The web app calls the API through `apps/web/src/lib/api.ts`.
4. Prisma talks to a local SQLite database at `apps/api/prisma/dev.db`.
5. Redis is optional locally. If `REDIS_URL` is empty or Redis is unavailable, the API falls back to an in-memory map.

### Recommended local startup

On Windows, the intended entry point is:

```powershell
.\dev.ps1
```

What `dev.ps1` does:

- Installs dependencies if `node_modules` is missing
- Runs first-time DB setup if `apps/api/prisma/dev.db` is missing
- Kills processes already listening on ports `3000` and `4000`
- Starts both apps with `npm run dev`

You can also run manually:

```bash
npm install
npm run setup:local
npm run dev
```

## Workspace Scripts

### Root scripts

- `npm run setup:local`: copies env files if missing, runs migration, runs seed
- `npm run db:generate`: Prisma client generation in `apps/api`
- `npm run db:migrate`: Prisma migrate in `apps/api`
- `npm run db:seed`: Prisma seed in `apps/api`
- `npm run db:import:addresses`: imports address reference CSV into the DB
- `npm run db:seed:optimizer-demo`: extra optimizer demo seeding in `apps/api`
- `npm run db:reset`: deletes local SQLite files, then reruns setup
- `npm run dev:web`: starts only Next.js
- `npm run dev:api`: starts only NestJS
- `npm run dev`: starts API and web together with `concurrently`
- `npm run build`: builds all workspaces that expose a build script
- `npm run lint`: runs workspace lint/typecheck scripts
- `npm run test`: runs workspace tests

### Repo helper scripts

- `scripts/setup-local.mjs`: copies `.env.example` into `.env`, `apps/api/.env`, and `apps/web/.env.local` if the targets do not exist yet
- `scripts/reset-local-db.mjs`: deletes local SQLite DB files under `apps/api/prisma/`
- `scripts/check-hebrew-mojibake.mjs`: helper for Hebrew text encoding checks

## Environment Configuration

The root `.env.example` currently contains:

```env
NODE_ENV=development
DATABASE_URL="file:./dev.db"
REDIS_URL=
JWT_ACCESS_SECRET=replace-me-access
JWT_REFRESH_SECRET=replace-me-refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_LOCALE=he
REQUEST_LOG_LEVEL=debug
```

Important notes:

- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be at least 16 characters according to `env.config.ts`.
- `DATABASE_URL` is SQLite by default.
- `REDIS_URL` is optional for local development.
- `NEXT_PUBLIC_API_URL` is used by the frontend API client.

## Frontend: `apps/web`

### What it is

`apps/web` is a Next.js App Router application. It renders the public pages, dashboards, and admin tools.

### Important frontend files

- `src/app/layout.tsx`: root app layout
- `src/app/page.tsx`: homepage
- `src/app/search/page.tsx`: listing search
- `src/app/bundle-request/page.tsx`: main bundle-builder experience
- `src/app/bundle-optimizer/page.tsx`: redirects to `/bundle-request`
- `src/app/listings/[id]/page.tsx`: listing details
- `src/app/admin/*`: admin pages
- `src/app/lender/*`: lender pages
- `src/app/renter/*`: renter pages
- `src/components/forms/bundle-optimizer-form.tsx`: main optimizer request UI
- `src/lib/api.ts`: browser/server-side API client

### Frontend request flow

The frontend uses `src/lib/api.ts` as the central API wrapper. It:

- Points to `NEXT_PUBLIC_API_URL` or `http://localhost:4000`
- Sends cookies with `credentials: "include"`
- Uses `cache: "no-store"`
- Tries to parse backend JSON errors into readable messages

### Demo fallback behavior

Some public-facing API calls have demo fallbacks when the API or DB is unavailable:

- `categories()`
- `listing(id)`
- `listings(query)`
- `searchListings(q)` falls back to an empty list, not demo listings

That means parts of the marketplace can still render with demo content even when the backend is not fully populated. Admin and most authenticated operations do not have those fallbacks.

### Main user-facing pages

- `/`: landing page
- `/about`
- `/how-it-works`
- `/search`
- `/categories/[slug]`
- `/listings/[id]`
- `/bundle-request`: primary smart bundle flow
- `/auth/sign-in`, `/auth/sign-up`
- `/renter/*`: renter dashboard, favorites, saved searches, orders, settings, checkout
- `/lender/*`: lender dashboard, listings, bookings, availability, pricing, analytics, profile, reviews
- `/admin/*`: dashboard, users, listings, categories, bookings, disputes, reviews, audit

## Backend: `apps/api`

### What it is

`apps/api` is a NestJS application. It exposes the marketplace API, auth, admin flows, address lookup, and the bundle optimization engine.

### API bootstrap behavior

`src/main.ts` configures:

- `helmet`
- `cookie-parser`
- CORS with credentials enabled
- global `ValidationPipe`
- global HTTP exception filter
- global request logging interceptor

Default port is `4000`.

### Backend module map

`src/app.module.ts` wires these main modules:

- `AuthModule`
- `UsersModule`
- `RentersModule`
- `LendersModule`
- `AddressesModule`
- `CategoriesModule`
- `ListingsModule`
- `AvailabilityModule`
- `PricingModule`
- `BookingsModule`
- `ReviewsModule`
- `NotificationsModule`
- `BundleOptimizerModule`
- `AuditModule`
- `AdminModule`
- `HealthModule`
- `PrismaModule`
- `RedisModule`

Cross-cutting behavior:

- request throttling is enabled globally with a limit of `120` requests per minute
- request context middleware runs on all routes

### Public health endpoint

`GET /health`

This checks the database with `SELECT 1` and returns Redis status. If Redis is not configured, the response reports the memory fallback rather than failing startup.

## Bundle Optimizer: How The Core Feature Works

### User input

The main optimizer form collects:

- rental date range
- pickup address using city, street, and house number
- budget
- optional max pickup points
- requested slots
- preference profile or custom sliders

Each slot can be:

- a category request
- a specific listing request

### Frontend payload

The form builds a request containing:

- `slots`
- `dateRange`
- `userLocation`
- `budget`
- `preferenceProfile`
- `preferenceSliders`
- optional `basePreferenceProfile`
- optional `maxPickupPoints`

The frontend includes tuning fields in the payload, but the backend explicitly overwrites algorithm-owned preference parameters before running the search.

### Backend optimizer pipeline

The optimizer entry point is:

- `POST /bundle-optimizer/search`

Request validation:

- `BundleOptimizerController` validates the request with a Zod schema

Search pipeline inside `BundleOptimizerService`:

1. Resolve the user-facing preference profile into internal weights and parameters.
2. Resolve renter location to lat/lng if only address selectors were submitted.
3. Build candidates per requested slot.
4. Reject impossible requests early if any slot has no candidates.
5. Run beam search to construct bundle combinations under budget and pickup constraints.
6. Score each complete bundle.
7. Apply Pareto filtering to remove dominated results.
8. Sort by final score and keep the top results.
9. Build human-readable explanations and tradeoff notes.

Returned response includes:

- request summary
- algorithm metadata
- ranked bundles
- score breakdowns
- derived metrics
- explanation strings
- debug information in non-production environments

### Scoring dimensions

From the code, the optimizer reasons about at least these dimensions:

- price
- distance
- reliability
- availability
- pickup simplicity / pickup count

The response also surfaces formula metadata describing a weighted multi-objective score with variance and bottleneck penalties.

## Addresses and Geocoding

### Address reference data

Address autocomplete depends on `City` and `Street` records in the database.

The import command is:

```bash
npm run db:import:addresses
```

The importer expects a CSV in the project root with address reference columns. This repo currently includes `ערים ורחובות.csv`, which appears to be the intended source file.

### Geocoding

When a renter supplies city, street, and address number, the backend geocodes that address through OpenStreetMap Nominatim.

Important behavior:

- calls are throttled to about 1 request per second
- results are cached in `AddressGeocodeCache`
- repeat lookups use cached coordinates
- if geocoding fails, the optimizer request can fail for unresolved addresses

## Database and Data Model

### Local database

Local development uses SQLite through Prisma:

- schema: `apps/api/prisma/schema.prisma`
- local DB file: `apps/api/prisma/dev.db`

### Main domain entities

- `User`
- `RenterProfile`
- `LenderProfile`
- `Category`
- `City`
- `Street`
- `Listing`
- `ListingMedia`
- `ListingAttributeValue`
- `ListingAvailabilityBlock`
- `PricingRule`
- `Booking`
- `BookingItem`
- `Review`
- `AuditLog`
- `SavedSearch`
- `Favorite`
- `Dispute`
- `Notification`
- `FeatureFlag`
- `DeliveryWindow`
- `AddressGeocodeCache`
- `PaymentIntentPlaceholder`

### Core relationships

- a `User` may have a renter profile or lender profile
- a `LenderProfile` owns many `Listing` records
- a `Category` forms a parent/child hierarchy
- a `Listing` belongs to a category and lender
- listings have media, attribute values, availability blocks, and pricing rules
- a `Booking` contains many `BookingItem` rows
- reviews link bookings, reviewers, reviewees, and sometimes listings

## Seed Data

### What `npm run db:seed` does today

The seed script currently:

- resets product and identity data
- creates demo admin, renter, and lender users
- creates renter and lender profiles
- inserts the category taxonomy

Important caveat:

- the main seed does not populate a real listing catalog by default

So after a normal seed, you should expect:

- users and taxonomy to exist
- little or no actual listing inventory unless you import or add it separately

This explains why some frontend flows depend on demo fallback data and why admin listing management matters for building a usable local catalog.

## Shared Packages

### `packages/ui`

Shared React UI components exported from `src/index.ts`, including:

- `Button`
- `Card`
- `ScorePill`
- `MetricBars`
- `ExplanationCard`
- `ReputationBadge`
- `ListingCard`
- `BundleBuilderRow`
- `MapPreviewCard`
- `ComparisonTable`

### `packages/types`

Shared TypeScript types, mainly from:

- `src/common.ts`
- `src/auth.ts`

### `packages/config`

Shared config exports:

- locales
- feature flags

### `packages/utils`

Shared helpers:

- distance utilities
- i18n utilities

## Auth and Session Model

The backend contains a full auth module with:

- registration
- login
- refresh flow
- JWT strategy
- refresh session persistence

Sessions are backed by the `RefreshSession` table. The web client sends cookies with API requests, so authenticated flows are expected to work through cookie-based session handling.

## Admin Surface

The frontend and API both include admin functionality for:

- user management
- listing management
- category management
- booking oversight
- dispute handling
- review moderation
- audit visibility

From the client code, the admin area already has dedicated API methods for creating, updating, deleting, duplicating, and reassigning listings.

## Docker and Infrastructure Notes

`docker-compose.yml` exists, but it does not match the current zero-setup local default perfectly.

What it defines:

- PostgreSQL
- Redis
- API container
- web container

What the code currently prefers for local development:

- SQLite
- optional Redis
- direct local process execution with `npm run dev` or `.\dev.ps1`

So treat Docker Compose as optional or partially legacy unless you intentionally adapt the schema/env for a containerized database workflow.

## Things To Know Before Extending The Project

- The optimizer is the most specialized part of the system. Changes there should be tested carefully because the pipeline combines filtering, search, scoring, and explanation generation.
- Address-based optimizer requests depend on imported address tables and working geocoding.
- Local seed data is identity-heavy and catalog-light.
- Some public UI paths are resilient because of demo fallback data, but many real CRUD flows still depend on a populated API database.
- Redis is not a hard local dependency because of the in-memory fallback in `RedisService`.

## Recommended First Steps For A New Developer

1. Run `npm install`.
2. Run `npm run setup:local`.
3. Start the app with `.\dev.ps1` or `npm run dev`.
4. Verify `http://localhost:4000/health`.
5. Open `http://localhost:3000/bundle-request`.
6. If address selectors are empty, run `npm run db:import:addresses`.
7. If you need real catalog behavior, create/import listings through admin flows or additional seed scripts.

## Short Mental Model

If you want one sentence for how this codebase works:

The web app collects a structured rental need, the NestJS API resolves it into candidates and optimized bundle combinations, Prisma persists the marketplace domain in SQLite, and shared packages keep UI, types, and config aligned across the monorepo.
