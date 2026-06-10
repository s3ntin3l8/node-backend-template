# CLAUDE.md

Guidance for working in this repository.

## Overview

A Fastify + TypeScript backend template (SQLite via Drizzle, encryption-at-rest,
security middleware, full CI/CD). ESM throughout (`"type": "module"`).

## Architecture

- **App factory**: `src/app.ts` exports `buildApp()`, which registers plugins
  then routes and returns the Fastify instance. `src/server.ts` calls it and
  handles listen + graceful shutdown (`SIGINT`/`SIGTERM`).
- **Plugins** (`src/plugins/`, all wrapped in `fastify-plugin`): `env`
  (validated config on `app.config`), `logging`, `security` (helmet,
  rate-limit, CORS), `db` (runs migrations, decorates `app.db` and
  `app.encryption`, closes the DB on shutdown).
- **Routes** (`src/routes/`): each exports an `async (app) => {}` plugin.
  `health` has `/health` (liveness) and `/ready` (DB ping). `users` is the
  example CRUD demonstrating `app.db` + `app.encryption` + JSON-schema validation.
- **DB** (`src/db/`): Drizzle schema/client/seed; SQL migrations in `drizzle/`.
  `getDb()`/`ensureDb()`/`closeDb()` manage a singleton connection.

## Commands

- `npm run dev` — reload server · `npm run build` — emit `dist/`
- `npm test` / `npm run test:coverage` — Vitest
- `npm run lint` · `npm run typecheck`
- `npm run db:generate` (after schema edits) · `npm run db:seed`

## Conventions

- **ESM imports use `.js` specifiers** even for `.ts` sources (Node16 resolution).
- Prefer `import type` for type-only imports (enforced by ESLint).
- Tests live in `test/`, mirroring `src/`, and use `app.inject()`. `test/setup.ts`
  gives each test file an isolated temp SQLite DB.
- Config is read from `app.config` (typed via the `declare module "fastify"`
  augmentation in `src/plugins/env.ts`) — not `process.env` directly.
- After changing `src/db/schema.ts`, run `npm run db:generate` and commit the
  generated migration.

## Before committing

Run `npm run lint && npm run typecheck && npm test`.
