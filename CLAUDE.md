# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rental Marketplace Platform ג€” a Hebrew-first RTL equipment rental marketplace with a Smart Bundle Recommendation Engine. NPM workspaces monorepo with two apps and four packages.

## Development Setup

```bash
npm install
npm run setup:local   # first-time only: creates .env files, migrates, seeds SQLite DB
npm run dev           # starts API (port 4000) + Next.js web app concurrently
```

No Docker or PostgreSQL needed locally. Prisma uses SQLite at `apps/api/prisma/dev.db`.

## Key Commands

| Task | Command |
|------|---------|
| Run all tests | `npm test -w apps/api` |
| Run a single test file | `npm test -w apps/api -- --testPathPattern=bundle-scoring` |
| API typecheck | `npm run lint -w apps/api` |
| Web typecheck | `npx tsc --noEmit -p apps/web/tsconfig.json` |
| API build | `npm run build -w apps/api` |
| Web build | `npm run build -w apps/web` |
| Regenerate Prisma client | `npm run db:generate` |
| Apply migrations | `npm run db:migrate` |
| Reseed DB | `npm run db:seed` |
| Full DB reset | `npm run db:reset` |

## Architecture

### Monorepo Structure

```
apps/api        NestJS 11, Prisma (SQLite locally), JWT auth, RBAC
apps/web        Next.js 15 App Router, React 19, TailwindCSS, RTL/Hebrew
packages/config locales and feature flags
packages/types  shared Zod contracts used by API and web
packages/ui     reusable RTL-aware React components
packages/utils  i18n helpers and geodesic distance calculation
```

Package aliases (`@rental/config`, `@rental/types`, `@rental/ui`, `@rental/utils`) are resolved via `tsconfig.base.json` paths.

### API (NestJS)

- Entry: `apps/api/src/main.ts` ג€” listens on `PORT` (default 4000)
- All routes require JWT auth by default; use `@Public()` decorator to opt out
- RBAC via `@Roles()` decorator + `RolesGuard`
- Global: `ValidationPipe` (whitelist + forbidNonWhitelisted), `HttpExceptionFilter`, `LoggingInterceptor`, rate limiter (120 req/min)
- `RequestContextMiddleware` attaches request context for audit logging
- Redis is optional; falls back to in-memory cache when `REDIS_URL` is unset

**Module list:** `auth`, `users`, `renters`, `lenders`, `categories`, `listings`, `availability`, `pricing`, `bookings`, `reviews`, `bundle-optimizer`, `addresses`, `admin`, `audit`, `notifications`, `health`.

### Bundle Recommendation Engine (the only one)

The core differentiator. There is exactly **one** live engine. It lives in `apps/api/src/modules/bundle-optimizer/` and is reached via a single endpoint:

```
POST /bundle-optimizer/search
```

The previous `bundle-search` module, the `packages/scoring` package, the `RankingConfig` admin UI, and the old `logistics` / `quality` scoring dimensions have all been removed. Do not reintroduce them.

**Canonical dimensions (4-tuple).** Every metric, weight, and threshold in the engine speaks the same vector:

```
price, distance, reliability, availability
```

**Heuristic pipeline** (`BundleOptimizerService.optimize`):

1. `PreferenceMappingService.resolvePreferences` ג€” turns the user's profile + sliders into normalized weights, low-score penalty multipliers, pickup amplifier, and **server-owned** algorithm parameters (`lambdaVariance`, `alphaBottleneck`, `betaPickup`, `gammaMaxDistance`, `alphaDistanceMix`, `topKPerSlot`, `beamWidth`). These tuning parameters are never accepted from the client.
2. `AddressesService.geocodeRenterAddress` ג€” resolves the renter's `{cityId, streetId, addressNumber}` to `{lat, lng}` once per request.
3. `CandidateFilterService.buildCandidatesPerSlot` - applies the **hard constraints** (listing status = ACTIVE, rental-day window, availability over the requested date range, per-slot min/max price, per-slot max distance, absolute budget), then per-candidate normalization and per-slot **top-K** pruning. Per-candidate `m_price` uses a budget-relative proxy (`10 * (1 - price / perSlotBudget)`), not pool-relative.
4. `BeamSearchService.search` ג€” beam search with budget, pickup-cap, and **inventoryCount** pruning (a listing cannot fill more slots than its physical inventory).
5. `BundleScoringService.calculateFinalScore` ג€” final objective: weighted utility גˆ’ variance penalty + bottleneck bonus גˆ’ pickup penalty גˆ’ max-distance penalty גˆ’ low-score penalty, clamped to `[0, 10]`. Bundle-level `M_price = clamp(10ֲ·(1 גˆ’ totalPrice/budget))`.
6. `ParetoFilterService.filter` - drops bundles dominated across the 4 metrics.
7. Sort by `finalScore` descending, take top 10.
8. `BundleExplanationService.build` ג€” Hebrew explanations + tradeoffs per bundle.

**Wire schema.** The client sends only user-facing inputs (slots, dateRange, userLocation, budget, optional `maxPickupPoints`, `preferenceProfile`, `preferenceSliders`, `basePreferenceProfile`). The wire schema is `optimizerRequestBodySchema` in `apps/api/src/modules/bundle-optimizer/bundle-optimizer.types.ts`; Zod strips any unknown keys so a client cannot inject algorithm parameters.

**`LenderReliabilityService`** (`apps/api/src/modules/bundle-optimizer/lender-reliability.service.ts`) computes the per-lender reliability signal from rating + completion-rate + verification level + response time + new-lender penalty.

### Web (Next.js App Router)

- Hebrew/RTL enforced at root: `apps/web/src/app/layout.tsx`
- API calls go through `apps/web/src/lib/api.ts` (wraps `fetch` with credentials, falls back to demo data when API is unavailable)
- Demo data fallbacks in `apps/web/src/lib/demo-data.ts` ג€” lets the UI work without a running API

**Route structure:**
- `/bundle-request` ג€” canonical renter entry: form that calls `POST /bundle-optimizer/search` via `api.optimizeBundle`.
- `/bundle-optimizer` ג€” server-side redirects to `/bundle-request` (kept for backward-compatible links).
- `/lender/dashboard`, `/lender/listings`, `/lender/bookings`, etc. ג€” lender flows.
- `/admin/dashboard`, `/admin/users`, `/admin/audit`, etc. ג€” admin dashboard. There is no admin UI for ranking presets; algorithm tuning is server-side.

### Environment Variables

Validated by Zod in `apps/api/src/shared/config/env.config.ts`. Required: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`. All others have defaults. `REDIS_URL` is optional.

`setup:local` creates `.env`, `apps/api/.env`, and `apps/web/.env.local` from `.env.example` files if missing.

### Testing

Tests use Jest + ts-jest. All test files match `*.spec.ts`. The `moduleNameMapper` in `apps/api/jest.config.ts` resolves `@rental/*` package aliases. Run tests with `--runInBand` (already set in the jest config).

### Key Design Notes

- **One engine, one endpoint.** The recommendation flow is `/bundle-request` ג†’ `POST /bundle-optimizer/search` ג†’ response from `apps/api/src/modules/bundle-optimizer/`. Do not introduce parallel scoring code paths.
- **Server-owned algorithm parameters.** `־»`, `־±`, `־²`, `־³`, `־·`, `topKPerSlot`, `beamWidth` live in `PreferenceMappingService.ALGORITHM_DEFAULTS`. To tune the optimizer, edit that one constant ג€” never accept these from the client.
- **Inventory is enforced.** Quantity > 1 slots are expanded by `CandidateFilterService` and bounded by `inventoryCount` inside `BeamSearchService`.
- **Payment**: Modeled as `PaymentIntentPlaceholder` ג€” intentionally not wired to a real PSP.
- **Maps**: Swappable provider pattern; current fallback adapter at `apps/web/src/lib/maps/provider.ts`.
- **SQLite ג†’ PostgreSQL**: Schema avoids connector-specific native types so it's portable; migration history would need to be reset if switching. The Prisma tables `BundleSearchRequest` and `RankingConfig` are orphans from the deleted legacy engine ג€” no live code reads or writes them; a future migration should drop them.
- **Seed scenarios**: Tradeoff scenarios (cheapest vs. balanced, reliable vs. expensive, same-lender pickup) for testing ranking behavior.
- **Product condition removal**: Product condition is intentionally not a listing field, filter, profile, metric, or ranking signal because it is self-reported by lenders and unreliable for ranking.
