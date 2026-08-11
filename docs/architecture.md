# Architecture

Source of truth for stack, conventions, and forward-looking decisions.

## Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Angular 18.2.0 (target: 22) | See "Migration plan" below |
| Backend | NestJS | Git subtree from `carlosdcastano/gestion-de-productos` |
| Database | PostgreSQL via Supabase | Connection in `backend/.env` |
| Auth | JWT (Bearer) | Tokens in `localStorage`; interceptor in `frontend/src/app/interceptors/auth.interceptor.ts` |
| Orchestration | Docker + docker-compose | Two services: `frontend`, `backend` |
| Styling | SCSS + Bootstrap | Per `docs/TECH_REQUIREMENTS.md` |

Reference: `README.md` for the high-level diagrams, `docs/TECH_REQUIREMENTS.md` for the spec.

## File structure

```
src/app/
├── pages/                  # Route page components
├── components/             # Reusable components
│   ├── layout/             # navbar, sidebar, footer
│   └── ui/                 # product-card, loading, search-bar
├── services/              # API services (HTTP only here)
├── guards/                # Route guards
├── interceptors/          # HTTP interceptors
├── models/                # TypeScript interfaces
└── app.routes.ts
```

Per `docs/TECH_REQUIREMENTS.md`. The team is currently converging on this; small deviations are OK as long as the contract holds.

## Conventions

### Angular

- **Standalone components**, no `NgModule` except `app.config.ts`.
- **DI:** prefer `inject()` over constructor injection.
- **Services:** `providedIn: 'root'`, no need to register in providers.
- **Forms:** template-driven (`[(ngModel)]` + `FormsModule`). Do not introduce reactive forms.
- **Control flow:** `@if` / `@for` (with `track`) / `@switch`. No `*ngIf` / `*ngFor`.
- **Naming:** pages under `pages/<name>/<name>.page.{ts,html,css}`. Routed components use `.page.ts` suffix.
- **DTOs:** separate from `models/*.ts` files. Use `models/<name>.dto.ts` to avoid editing the team's shared models.

### HTTP

- All backend calls live in services. No `HttpClient` calls from components.
- The auth interceptor (`auth.interceptor.ts`) attaches `Authorization: Bearer <token>` automatically. Do not write headers manually.
- Handle status codes per `docs/TECH_REQUIREMENTS.md` §Error handling.

### Linting

- **Frontend:** ESLint 8.x via `@angular-eslint` (configured in this PR). `npm run lint` runs `ng lint`.
- **Backend:** ESLint 9.x via `typescript-eslint` (already configured). `npm run lint` runs `eslint .`.
- Lint rules are present-tense, not aspirational. If a rule is wrong, propose a change via the decision-compliance skill, don't disable it locally.

### Backend

- `backend/` is a git subtree. Local edits are expected for Supabase compat and Docker orchestration, but **do not refactor or "modernize" files you are not actively working on.**
- See `docs/git-workflow.md` §"Working with backend subtree" for the pull workflow.

## Migration plan — Angular 18 → 22

> **Status: Planned.** Trigger: once the currently active PRs close.

The classroom spec (`gistfile1.md`) specifies Angular 22. The code was scaffolded at Angular 18.2.0. We accept the temporary drift to ship the current sprint, and migrate after.

| Aspect | Current | Target |
|--------|---------|--------|
| `@angular/core` | 18.2.0 | 22.x |
| `@angular/cli` | 18.2.21 | 22.x |
| `node:20-alpine` base | ✓ | ✓ (only bump if Angular 22 requires it) |
| `@angular-eslint` | not configured | set up in this PR |
| `rxjs` | 7.8.0 | keep ≤ 22-compatible |
| `zone.js` | 0.14.10 | migrate to zoneless if 22 deprecates |

**Migration steps (when triggered):**

1. `ng update @angular/core@22 @angular/cli@22` from a fresh branch off `develop`.
2. Address breaking changes (to be enumerated when the bump is run).
3. Bump `frontend/Dockerfile` `node:20-alpine` if required by Angular 22.
4. Run lint + build + (if any) tests in CI.
5. After successful merge, remove the "Migration plan" section from this file and update `README.md` and `backlog.md` to reflect Angular 22.

**Why the spec wins:** `gistfile1.md` is the assignment source of truth. The 18 codebase is a transitional state, not a permanent choice.

**Drift carriers** (intentional, until migration):

- `frontend/package.json` — `@angular/core: ^18.2.0` (current)
- `README.md` — says "Angular 18" (current)
- `docs/traceability.md` — says "Angular 18" (current)
- `backlog.md` — says "Angular 22" (target)
- `CONTRIBUTING.md` (rewritten in this PR) — says "Angular 18.2.0 (target: 22)" (current + target)
- `gistfile1.md` — "Angular 22" (spec, source of truth)

## Decisions log

| Date | Decision | Where recorded |
|------|----------|----------------|
| 2026-08-11 | Angular 22 is the target; we ship at 18.2.0 as a transitional state, migrate after current PRs close | this file, "Migration plan" |
| 2026-08-11 | Governance docs live in `docs/` (root), not `.opencode/docs/` — see issue #48 comment thread | `AGENTS.md` governance hierarchy |
| 2026-08-11 | Topic docs (not ADR-style) for governance in this sprint | `AGENTS.md` governance hierarchy |

## Pending follow-ups

- Angular 18 → 22 migration (see above).
- ESLint rules for production (`@angular-eslint` is configured with defaults; tighten if needed).
- Light CHANGELOG once the migration lands.
