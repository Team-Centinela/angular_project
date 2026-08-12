# Contributing Guide

This is the entry point for humans. The full governance lives in `docs/`.

## Read first

- **`AGENTS.md`** — top-level instructions for any contributor (human or AI agent).
- **`docs/architecture.md`** — stack, conventions, in-flight migrations (incl. Angular 18 → 22 plan).
- **`docs/git-workflow.md`** — branches, commits, PRs, merge strategy, branch protection, review process.
- **`docs/security.md`** — secrets, env files, scanning, Dependabot, incident response.

## Repository structure

This is a monorepo-style project with:

- **`frontend/`** — Angular 18.2.0 application (target: 22 per `gistfile1.md`).
- **`backend/`** — NestJS API (git subtree from `gestion-de-productos`).

See `docs/architecture.md` for the full stack and conventions.

## Working with backend subtree

`backend/` is a git subtree from `carlosdcastano/gestion-de-productos`. See `docs/git-workflow.md` §"Working with backend subtree" for the pull workflow and local edit conventions.

## Quick links

- Open an issue: use the templates under `.github/ISSUE_TEMPLATE/`.
- Open a PR: GitHub will populate the template from `.github/PULL_REQUEST_TEMPLATE.md`.
- Reviewer guidance: `docs/git-workflow.md` §"Review process".

## Stakeholder

Carlos D. Castaño is the **stakeholder** (activity owner, not a code reviewer). For team composition and roles, see `README.md`.