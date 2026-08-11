# Contributing Guide

## Repository Structure

This is a monorepo-style project with:

- **`src/`** — Angular 22 frontend application
- **`backend/`** — NestJS API (added as a git subtree from [gestion-de-productos](https://github.com/carlosdcastano/gestion-de-productos.git))

> **Project timeline note:** This is a one-week project. `backend/` is expected
> to receive only one or two small upstream commits during that window (bug
> fixes). Local edits to `backend/` are expected to be limited to making it
> compatible with Supabase and adding Docker orchestration. See
> [Working with Backend Subtree](#working-with-backend-subtree) for why a
> subtree was chosen over a plain vendored folder, and what that choice does
> and doesn't guarantee.

## Git Workflow

### Branch Strategy

```mermaid
gitGraph
    commit id: "initial"
    branch develop
    checkout develop
    commit id: "feat/setup"
    branch feature/login
    checkout feature/login
    commit id: "feat/login-form"
    commit id: "feat/login-validation"
    checkout develop
    merge feature/login id: "squash"
    branch feature/products
    checkout feature/products
    commit id: "feat/products-crud"
    checkout develop
    merge feature/products id: "squash"
    checkout main
    merge develop id: "merge --no-ff" type: HIGHLIGHT
```

### Branch Types

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/user-auth` |
| `feat/` | Same as feature (alias) | `feat/shopping-cart` |
| `chore/` | Maintenance, dependencies | `chore/update-deps` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `docs/` | Documentation only | `docs/api-docs` |
| `refactor/` | Code restructuring | `refactor/services` |

### Branch Naming Convention

```
<type>/<short-description>
feature/user-authentication
chore/update-angular-22
fix/category-delete-error
```

---

## Merge Strategy

> **All merges into `develop` and `main` happen through a Pull Request.**
> Nobody pushes directly to either branch, even if they know the equivalent
> git command. The commands below are shown so you understand what the PR
> merge button is doing under the hood — not as steps to run locally against
> a protected branch.

### Feature → Develop: Squash Merge

Feature branches merge into `develop` using **squash merge**.

1. Open a PR from your `feature/...` branch into `develop`.
2. On GitHub, use **"Squash and merge"**.
3. Edit the squash commit message to follow [Conventional Commits](https://www.conventionalcommits.org/) (see below).

This is equivalent to:

```bash
git checkout develop
git merge --squash feature/my-feature
git commit -m "feat: my feature description"
```

**Why squash?** Keeps `develop`'s history clean while preserving granular commits in the feature branch if needed for debugging.

### Develop → Main: Merge Commit (`--no-ff`)

Releases from `develop` into `main` use a **real merge commit**, never a squash or rebase.

1. Open a PR from `develop` into `main`.
2. On GitHub, use **"Create a merge commit"** (this is the GUI equivalent of `--no-ff`: it always records a merge commit, even when a fast-forward is possible).
3. Merge, then tag the release.

Using the CLI:

```bash
gh pr create \
  --base main \
  --head develop \
  --title "sync: merge develop into main" \
  --body "Regular develop → main sync. Merge commit (not squash) to preserve shared history."

gh pr merge <PR_NUMBER> --merge
```

This is equivalent to:

```bash
git checkout main
git merge --no-ff develop -m "Release: v1.0"
git tag -a v1.0 -m "Version 1.0 release"
git push origin main --tags
```

**Do not run the raw `git merge --no-ff` + `git push` sequence directly against `main`.** If `main` is a protected branch (required reviews, required checks, or "require PR before merging" enabled), that push will be rejected. Use the PR flow above instead.

**Why `--no-ff`?** It creates a merge commit that clearly marks the release boundary in `main`'s history. It doesn't pollute the narrative — it **clarifies** it.

> **Optional repo setting:** if you want to guarantee the correct merge
> strategy is used and prevent accidental squash/rebase clicks on release
> PRs, go to **Settings → General → Pull Requests** and disable "Allow squash
> merging" and "Allow rebase merging," or scope the restriction to `main`
> only via a branch ruleset.

---

## Working with Backend Subtree

The `backend/` directory is a git subtree pointing to the [gestion-de-productos](https://github.com/carlosdcastano/gestion-de-productos.git) repository.

### Why a subtree instead of a plain folder

Given the one-week scope of this project, upstream `gestion-de-productos` is
only expected to gain a commit or two (small fixes) during that window, and
this team is not going to be submitting PRs back to it. A plain vendored
folder was considered, but a subtree was chosen anyway because it keeps a
one-command way to pull those one or two upstream fixes
(`git subtree pull`) without hand-copying files or diffing manually. With
so few expected upstream changes and non-overlapping local edits (Supabase
config, Docker orchestration), conflicts on those pulls are expected to be
rare to nonexistent.

This is a pragmatic, short-lived use of subtree as a **one-way import
convenience** — not the classic subtree pattern of eventually contributing
changes back upstream.

### Pulling Latest Backend Changes

When the backend team pushes updates, fetch them into your local subtree:

```bash
# Add remote (only needed once)
git remote add backend-origin https://github.com/carlosdcastano/gestion-de-productos.git

# Fetch latest backend changes
git fetch backend-origin

# Pull into the subtree
git subtree pull --prefix=backend backend-origin <branch> --squash
```

Example with specific branch:
```bash
git subtree pull --prefix=backend backend-origin main --squash
```

### Making Local Changes to `backend/`

Direct edits to `backend/` (e.g., Supabase compatibility, Docker
orchestration) are expected and fine for this project. A few things worth
knowing about how they interact with future pulls:

- `git subtree pull` performs a normal three-way merge, not an overwrite.
  Local edits in files or lines upstream didn't touch will merge cleanly;
  edits on the same lines upstream also changed will produce a normal merge
  conflict for you to resolve, same as any other `git merge`. Nothing is
  silently lost.
- These local edits are **not** being contributed back to
  `gestion-de-productos`, so `backend/` will diverge from upstream over
  time. For a one-week project with one or two expected upstream commits,
  this divergence is expected to stay small and low-risk. If this project
  ever outlives that scope, treat `backend/` as a local fork at that point —
  don't expect it to cleanly reconcile with upstream indefinitely, and note
  that `--squash` history makes pushing changes back upstream awkward if
  that ever becomes a goal.

### Replacing Subtree with New Remote

If the backend repository changes URL or you're setting up fresh:

```bash
# Remove old remote
git remote remove backend-origin

# Add new remote
git remote add backend-origin https://github.com/new-repo-url.git

# Verify
git subtree pull --prefix=backend backend-origin main --squash
```

---

## Pull Request Checklist

Before opening a PR:

- [ ] Branch name follows convention (`feature/`, `chore/`, etc.)
- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] PR description explains **what** and **why**, not just "fixed stuff"
- [ ] All tests pass (if applicable)
- [ ] No console.log or debug code left behind
- [ ] Correct GitHub merge strategy selected: **Squash and merge** for `feature/* → develop`, **Create a merge commit** for `develop → main`

### Commit Message Format

```
<type>: <short description>

[optional body with more details]
```

Examples:
```
feat: add JWT interceptor for auth
fix: redirect loop on 401 response
chore: update Angular to 22.1
docs: add API endpoint documentation
```

---

## Quick Reference

| Action | How |
|--------|-----|
| Create feature branch | `git checkout -b feature/my-feature` |
| Merge feature → develop | Open PR, use **"Squash and merge"** on GitHub |
| Merge develop → main (release) | Open PR, use **"Create a merge commit"** on GitHub |
| Update backend subtree | `git subtree pull --prefix=backend backend-origin main --squash` |
| Check subtree status | `git log --oneline --graph --decorate --all` |