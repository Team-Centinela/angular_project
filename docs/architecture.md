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
├── utils/                 # Shared helpers (kebab-case + `.util.ts` suffix — see Decisions log)
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
- **I/O:** use `input()` / `output()` (signal-based, Angular 17.1+/18) for **new** component I/O. Existing `@Input` / `@Output` decorator-based components are grandfathered; convert them opportunistically (typically when the component is touched for other reasons). Parents read the same `[input]` / `(output)` property bindings — signal-based I/O is API-compatible from the consumer's perspective.

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
| `node:22-alpine` base (CI; Dockerfiles still on 20) | ✓ | ✓ (only bump if Angular 22 requires it) |
| `@angular-eslint` | not configured | set up in this PR |
| `rxjs` | 7.8.0 | keep ≤ 22-compatible |
| `zone.js` | 0.14.10 | migrate to zoneless if 22 deprecates |

**Migration steps (when triggered):**

1. `ng update @angular/core@22 @angular/cli@22` from a fresh branch off `develop`.
2. Address breaking changes (to be enumerated when the bump is run).
3. Bump `frontend/Dockerfile` `node:22-alpine` (or what Angular 22 requires) and reconcile with CI.
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
| 2026-08-11 | **PROPOSED** — awaiting team review: when a CI lint gate surfaces pre-existing issues in untouched `backend/` subtree code, surgical fixes (≤1 line per file: type annotations, `void` prefixes, targeted `eslint-disable` with justification) are permitted so the new gate can turn green. This is consistent with `docs/git-workflow.md` §"Working with backend subtree" — minimal diffs to keep subtree pulls clean are already allowed, and CI-lint compliance is in the same category. Non-surgical refactors of unrelated backend files remain forbidden. | This file, this row |
| 2026-08-12 | **ACCEPTED** — Migration was accepted and Architecture is sound, ARCHITECTURE.md may change after new Angular 22 skill is added later, but currently it's accepted to work on current sprint. Explicit acceptance recorded by SrLampi1001 (incident-response reviewer per `docs/git-workflow.md` §"Review process") on PR #73 review thread. | This file, this row |
| 2026-08-13 | **PROPOSED** — awaiting team review: utility files in `frontend/src/app/utils/` use kebab-case with a `.util.ts` suffix (e.g. `safe-return-url.util.ts`), aligning with the role-suffix convention already used by `*.component.ts`, `*.service.ts`, `*.guard.ts`, `*.interceptor.ts`, `*.page.ts`. Models stay suffix-less (`models/product.ts`). Rename of `safe-return-url.ts` → `safe-return-url.util.ts` applied in this PR; team to ratify. | This file, this row |
| 2026-08-13 | **ACCEPTED** — use kebab-case with `util.ts` suffix (e.g. `sage-return-url.utils.ts`), `*.page.ts`. Models stay suffix-less. | PR #101 [Follow-up comment](https://github.com/Team-Centinela/angular_project/pull/101#issuecomment-5280600285)|
| 2026-08-14 | **PROPOSED** — awaiting team review: adopt **Jest 29 + jest-preset-angular 14** as the frontend test runner for the current Angular 18.2.0 codebase (replacing the Angular-default Karma+Jasmine). Rationale: (1) **Speed** — Jest runs in pure Node with `jest-environment-jsdom`, no Chromium launcher to spin up per run; local smoke suite completes in ~1.5 s vs Karma's typical 10–30 s. (2) **DX** — built-in watch mode, snapshot diffing, and module mocking remove ~3 `karma-*` plugin deps. (3) **Angular 18 fit** — `jest-preset-angular@14` covers the signal-based DI used in `app.config.ts` via `setupZoneTestEnv()` + `customExportConditions: ['node', 'node-addons']`. (4) **Angular 22 alignment** — Angular 22's default test runner is Vitest, not Karma; migrating from Jest → Vitest is mechanical (config + import changes), whereas Karma → Vitest is a full rewrite. Karma deps (`karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `jasmine-core`, `@types/jasmine`) stay in `devDependencies` for now and are slated for removal in a follow-up. Status will be flipped to `ACCEPTED` only after explicit team review per the decision-compliance skill. | PR #118 (Closes #113) |

## Pending follow-ups

- Angular 18 → 22 migration (see above).
- ESLint rules for production (`@angular-eslint` is configured with defaults; tighten if needed).
- Light CHANGELOG once the migration lands.
