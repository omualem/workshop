# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rental Marketplace Platform — a Hebrew-first RTL equipment rental marketplace with a Smart Bundle Ranking Engine. NPM workspaces monorepo with two apps and five packages.

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
packages/config locales, feature flags, ranking presets and constants
packages/scoring weight normalization and stability-adjusted scoring math
packages/types  shared Zod contracts used by API and web
packages/ui     reusable RTL-aware React components
packages/utils  i18n helpers and geodesic distance calculation
```

Package aliases (`@rental/config`, `@rental/scoring`, etc.) are resolved via `tsconfig.base.json` paths.

### API (NestJS)

- Entry: `apps/api/src/main.ts` — listens on `PORT` (default 4000)
- All routes require JWT auth by default; use `@Public()` decorator to opt out
- RBAC via `@Roles()` decorator + `RolesGuard`
- Global: `ValidationPipe` (whitelist + forbidNonWhitelisted), `HttpExceptionFilter`, `LoggingInterceptor`, rate limiter (120 req/min)
- `RequestContextMiddleware` attaches request context for audit logging
- Redis is optional; falls back to in-memory cache when `REDIS_URL` is unset

**Module list:** `auth`, `users`, `renters`, `lenders`, `categories`, `listings`, `availability`, `pricing`, `bookings`, `reviews`, `bundle-search`, `admin`, `audit`, `notifications`, `health`

### Bundle Search Engine

The core differentiator. Located in `apps/api/src/modules/bundle-search/`:

- `bundle-generation.service.ts` — finds candidate listing combinations per requested item
- `bundle-scoring.service.ts` — applies dimension scores and weights to each bundle
- `bundle-explanation.service.ts` — generates human-readable Hebrew explanations for rankings
- `ranking-config.service.ts` — resolves active preset or custom weights from `RankingConfig` table
- `lender-reliability.service.ts` — computes reliability scores from review/booking history

Scoring formula lives in `packages/scoring/src/math.ts`:
1. Normalize 5 dimensions to 0–10: `price`, `reliability`, `logistics`, `availability`, `quality`
2. Compute weighted mean using active preset weights
3. Apply stability penalties: std-dev imbalance penalty, low-score penalty (below threshold), bottleneck adjustment (bonus from minimum dimension)
4. Clamp final score to 0–10

Constants (`RANKING_STD_DEV_ALPHA`, `RANKING_LOW_SCORE_BETA`, etc.) live in `packages/config/src/ranking.ts`. Default presets also live there; admin-editable presets are stored in the `RankingConfig` DB table.

### Web (Next.js App Router)

- Hebrew/RTL enforced at root: `apps/web/src/app/layout.tsx`
- API calls go through `apps/web/src/lib/api.ts` (wraps `fetch` with credentials, falls back to demo data when API is unavailable)
- Demo data fallbacks in `apps/web/src/lib/demo-data.ts` — lets the UI work without a running API

**Route structure:**
- `/bundle-request` — renter submits a bundle search request
- `/renter/bundle-results`, `/renter/compare` — results and comparison views
- `/lender/dashboard`, `/lender/listings`, `/lender/bookings`, etc. — lender flows
- `/admin/ranking`, `/admin/audit`, `/admin/users`, etc. — admin dashboard

### Environment Variables

Validated by Zod in `apps/api/src/shared/config/env.config.ts`. Required: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`. All others have defaults. `REDIS_URL` is optional.

`setup:local` creates `.env`, `apps/api/.env`, and `apps/web/.env.local` from `.env.example` files if missing.

### Testing

Tests use Jest + ts-jest. All test files match `*.spec.ts`. The `moduleNameMapper` in `apps/api/jest.config.ts` resolves `@rental/*` package aliases. Run tests with `--runInBand` (already set in the jest config).

### Key Design Notes

- **Payment**: Modeled as `PaymentIntentPlaceholder` — intentionally not wired to a real PSP
- **Maps**: Swappable provider pattern; current fallback adapter at `apps/web/src/lib/maps/provider.ts`
- **SQLite → PostgreSQL**: Schema avoids connector-specific native types so it's portable; migration history would need to be reset if switching
- **Seed scenarios**: Three intentional tradeoff scenarios (cheapest vs. balanced, reliable vs. expensive, same-lender logistics) for testing ranking behavior
