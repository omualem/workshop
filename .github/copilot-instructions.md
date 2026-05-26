# Copilot instructions (for GitHub Copilot CLI sessions)

## Build, test and lint (use these exact commands)

- Install deps: npm install
- First-time setup (migrations + seed): npm run setup:local
- Start both servers (Windows): .\dev.ps1
- Start both servers (cross-platform): npm run dev
- Start web only: npm run dev:web
- Start API only (dev): npm run dev:api
- Build everything: npm run build
- Lint workspace: npm run lint
- API lint/typecheck: npm run lint -w apps/api
- Web typecheck: npx tsc --noEmit -p apps/web/tsconfig.json

Testing:
- Run all API tests: npm test -w apps/api
- Run a single API test file: npm test -w apps/api -- --testPathPattern=<file-or-pattern>
- Jest is configured for ts-jest; tests use *.spec.ts and run with --runInBand in the Jest config.

Database helper scripts (local):
- Regenerate Prisma client: npm run db:generate
- Apply migrations: npm run db:migrate
- Reseed DB: npm run db:seed
- Full reset + reseed: npm run db:reset

## High-level architecture

- Monorepo (npm workspaces): apps/* (apps/web, apps/api) and packages/* (config, types, ui, utils).
- apps/api: NestJS 11 + Prisma (SQLite locally), JWT auth by default, RBAC via @Roles(), entry: apps/api/src/main.ts.
- apps/web: Next.js 15 (App Router), React 19, RTL/Hebrew UI; API wrappers and demo fallbacks in apps/web/src/lib.
- TS path aliases configured in tsconfig.base.json (use @rental/* imports across packages).

## The bundle recommendation engine — read before changing anything related

There is exactly **one** live recommendation engine. Do not introduce a second.

- Endpoint: `POST /bundle-optimizer/search`
- Module: `apps/api/src/modules/bundle-optimizer/`
- Canonical 4 dimensions: `price`, `distance`, `reliability`, `availability`
- Web entry: `/bundle-request` (canonical) and `/bundle-optimizer` (redirects to `/bundle-request`)
- Web client call: `api.optimizeBundle` in `apps/web/src/lib/api.ts`

Heuristic pipeline (in this order):
1. Resolve user profile + sliders → weights, penalty multipliers, **and server-owned algorithm parameters** (`PreferenceMappingService`).
2. Geocode renter location.
3. Hard-filter candidates per slot (status=ACTIVE, condition floor, rental-day window, availability, per-slot min/max price, per-slot max distance, absolute budget) → per-slot top-K pruning (`CandidateFilterService`). Per-candidate price scoring is budget-relative, not pool-relative.
4. Beam search with budget / pickup-cap / inventoryCount pruning (`BeamSearchService`).
5. Final weighted scoring with variance penalty, bottleneck bonus, pickup penalty, max-distance penalty, low-score penalty; clamp to [0, 10] (`BundleScoringService`).
6. Pareto filter (`ParetoFilterService`).
7. Sort by final score, take top 10.
8. Hebrew explanations (`BundleExplanationService`).

**Algorithm tuning parameters are server-owned**: `lambdaVariance`, `alphaBottleneck`, `betaPickup`, `gammaMaxDistance`, `alphaDistanceMix`, `topKPerSlot`, `beamWidth`. They live in `PreferenceMappingService.ALGORITHM_DEFAULTS` and are *never* accepted from the client. The wire schema is `optimizerRequestBodySchema`; Zod strips unknown keys.

**What does not exist (do not recreate):**
- `apps/api/src/modules/bundle-search/` — deleted.
- `packages/scoring/` — deleted.
- `RankingConfig` admin UI / endpoint — deleted.
- Old dimensions `logistics` / `quality` — removed from all live scoring code.
- Route `POST /bundle-search` — removed.

The Prisma tables `BundleSearchRequest` and `RankingConfig` are dormant orphans (no code reads or writes them); a future migration will drop them — do not add code that references them.

## Key conventions and repository-specific notes

- Workspace script flags: use -w <workspace> to run a script in a single package (e.g., -w apps/api); use -ws for workspace-wide commands (build/lint/test when available).
- API routes are protected by default; mark controllers/handlers with @Public() to opt out.
- RBAC via @Roles() + RolesGuard; global ValidationPipe uses whitelist + forbidNonWhitelisted.
- Prisma local DB: apps/api/prisma/dev.db; setup scripts create .env files from .env.example.
- Prefer .\dev.ps1 on Windows (kills stale servers and starts both apps).
- Tests: Jest + ts-jest; test files are *.spec.ts. Use --testPathPattern to run specific tests.
- Package aliases: defined in tsconfig.base.json — resolve @rental/* imports in tooling and tests.

## Helpful files to inspect
- CLAUDE.md (repo-level documentation with commands and architecture)
- tsconfig.base.json (paths / aliases)
- apps/api/src/modules/bundle-optimizer/ (the only recommendation engine)
- apps/api/src/modules/bundle-optimizer/preference-mapping.service.ts (where algorithm parameters and defaults live)
- apps/api/src/modules/bundle-optimizer/bundle-optimizer.types.ts (wire schema vs. internal types)

---

(End of file)
