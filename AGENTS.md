# AGENTS.md

> Read this first before doing anything in this repository. This file is for AI coding agents and humans curious about how the team works.

## What this project is

Fullstack product-management application: Angular frontend, NestJS backend (git subtree from `gestion-de-productos`), PostgreSQL via Supabase, Docker orchestration. One-week sprint, 5 frontend developers, 1 stakeholder.

**Stack target (per `gistfile1.md`):** Angular 22. **Current code:** Angular 18.2.0 — migration is planned after currently active PRs close. See `docs/architecture.md` for the migration plan and the rationale for treating the drift as planned, not accidental.

## Governance hierarchy

Read these in order before non-trivial work:

1. `docs/architecture.md` — stack, conventions, in-flight migrations
2. `docs/git-workflow.md` — branches, commits, PRs, merge strategy, branch protection
3. `docs/security.md` — secrets, env files, scanning, Dependabot
4. `docs/TECH_REQUIREMENTS.md` — what pages/components/services must exist
5. `CONTRIBUTING.md` — entry point for humans (links to the above)

`/AGENTS.md` plus all of `docs/` plus `.opencode/` are the source of truth for governance. The README is descriptive.

## The decision-compliance skill

This repo uses the **decision-compliance** skill at `.opencode/skills/decision-compliance/SKILL.md`. Before introducing a new library, datastore, module, file convention, or contradicting any written constraint: load the skill, run Phase 1 (Discovery) and Phase 2 (Compliance gate).

If a change sets precedent, the skill requires a record of the decision — typically in the relevant topic doc (`docs/architecture.md` for stack, `docs/security.md` for secrets, etc.). Do not mark your own record as `ACCEPTED`; new records start as `PROPOSED` until the user explicitly accepts them.

## Hard rules

- **Never commit secrets.** Real `.env` values, API keys, JWT secrets, database URLs, or any Supabase credentials go to local `.env` files only. Use `.env.example` templates with placeholders. See `docs/security.md`.
- **Never push to `main` or `develop` directly.** Always via PR. `main` requires 1 approval + CI green; `develop` requires 1 approval. See `docs/git-workflow.md`.
- **Never force-push** to `main` or `develop`. Locally rebasing a feature branch is fine.
- **One issue per PR.** Reference it with `Closes #N` in the commit message or PR body.
- **Ask, don't override.** If a constraint and a code change conflict, stop and present the conflict (per the decision-compliance skill).

## Team conventions (quick reference)

- **Angular:** standalone components, `inject()` for DI, `providedIn: 'root'` services, `@if`/`@for` for control flow, `ngModel` for forms (template-driven, not reactive).
- **HTTP:** all backend calls go through services; the auth interceptor adds JWT automatically.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- **Branches:** `<type>/<short-description>` per `docs/git-workflow.md`.
- **PRs:** squash merge into `develop`, merge commit (`--no-ff`) into `main`.

## What NOT to do

- Don't change lockfiles (`package-lock.json`) manually — only via `npm install` or Dependabot.
- Don't edit `backend/` except for Supabase compat or Docker orchestration — it's a git subtree.
- Don't add stories to `backlog.md` outside the current sprint scope.
- Don't introduce a new dependency without justifying it (per the decision-compliance skill, that's a precedent).
- Don't mark a decision record as `ACCEPTED` without explicit user approval.
- Don't refactor the README's role table — Carlos is the **stakeholder**, not a code reviewer. (Drift noted, not fixed in this PR.)

## When you don't know

If the task is ambiguous or the change might set precedent, ask before coding. Use the decision-compliance skill's reporting format: state the constraint, the proposed change, and the conflict.

## Repository quick reference

| Path | What it is |
|------|------------|
| `frontend/` | Angular 18.2.0 application |
| `backend/` | NestJS API (git subtree) |
| `docs/` | Governance + tech requirements + traceability |
| `.opencode/` | Skills for AI agents |
| `.github/` | Workflows, Dependabot, CODEOWNERS, templates |
| `gistfile1.md` | Source-of-truth assignment spec |
| `backlog.md` | Sprint plan (one-week horizon) |
| `docker-compose.yml` | Orchestration |
