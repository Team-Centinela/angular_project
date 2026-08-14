# Security

Source of truth for secrets, env files, and scanning.

## Secrets policy

**Never commit real secrets.** Real values go to local `.env` files only. The repository tracks `.env.example` files with placeholder values.

Secrets include:

- `DATABASE_URL` (Supabase PostgreSQL connection string)
- `JWT_SECRET` (signing key)
- `JWT_EXPIRES_IN` (tracked alongside the secret for parity)
- Any third-party API keys (Sentry, Stripe, etc.)
- PEM files, private keys, `*.key` files

## What files must NEVER be committed

- `*.env` (real, non-example files)
- `*.pem`, `*.key`
- `backend/.env`, `frontend/.env`, root `.env`
- Any file containing a real `DATABASE_URL`
- `planeacion.md` and `trazabilidad.md` (per `.gitignore`; team-internal docs)

## .gitignore

The root `.gitignore` already excludes:

```
.env
.env.*
!.env.example
```

Backend and frontend have their own `.gitignore` files with additional excludes. Use them when adding secrets to a sub-package.

## .env.example

The `backend/.env.example` file ships with placeholder values:

```
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:5432/postgres
JWT_SECRET=cambia-este-valor-por-uno-generado-aleatoriamente
JWT_EXPIRES_IN=1d
```

When copying to `.env`, replace placeholders with real values. **Do not** commit the resulting `.env`.

The frontend ships `frontend/.env.example` as a placeholder for `API_BASE_URL`. The values used by `ng build` / `ng serve` come from `frontend/src/environments/environment*.ts` (selected by `fileReplacements` in `angular.json`). The frontend has no client-side secrets; do not commit a real `frontend/.env`.

## GitHub secret scanning

Configured at the repo level (issues #46, #48):

- **Secret scanning:** enabled.
- **Push protection:** enabled (blocks pushes that contain detected secrets).
- **Pre-commit hook:** not configured. To catch secrets before pushing, run `gitleaks detect` locally.

## CI secret scanning

`.github/workflows/secrets-scan.yml` runs `gitleaks` on every PR. PRs with detected secrets fail CI.

## Incident response

If a secret is committed:

1. **Rotate the credential immediately** at the provider (Supabase, etc.).
2. Open an issue with the `security` label.
3. Coordinate `git filter-repo` to scrub history with the team (`SrLampi1001` is the owner of this process). See issue #46 for the protocol.
4. Update this doc with the incident summary.

For the current state of the cleanup, see issue #46.

## Dependencies

Dependabot is configured at `.github/dependabot.yml`:

- **Schedule:** weekly (Mondays).
- **Auto-merge:** patch-level security updates only (configured in GitHub repo settings, not in `dependabot.yml`).
- **Tracks:** `npm` in `/frontend` and `/backend`, `docker` for the base images, `github-actions` for workflows.

For major/minor bumps, manual review is required.

## The .opencode/ folder

`.opencode/` contains `skills/` — instructions for AI agents. It is **not** a secrets carrier; safe to commit. Skills are public in the repo.

The `.opencode/skills/decision-compliance/SKILL.md` skill is the operative one for any agent doing governance-relevant work.

## Branch protection (security-relevant)

- `main` and `develop` do not allow force-push.
- Direct pushes to `main` and `develop` are blocked (PRs only).
- See `docs/git-workflow.md` §"Branch protection" for the full rules.
