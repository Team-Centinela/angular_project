# Pull Request

## What does this PR do?

<!-- Briefly describe the change. -->

## Why?

<!-- What problem does this solve? Link the issue with `Closes #N`. -->

Closes #

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactor / tooling (no behavior change)

## Pre-merge checklist

- [ ] Branch name follows convention (`feature/`, `chore/`, `fix/`, etc.)
- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] PR description explains **what** and **why**, not just "fixed stuff"
- [ ] I have **not** committed any secrets (real `.env` values, API keys, JWT secrets, DB URLs, PEM files, `.key` files)
- [ ] If introducing a new dependency, I checked `docs/architecture.md` and the decision-compliance skill (`.opencode/skills/decision-compliance/SKILL.md`)
- [ ] If this PR affects another integrator's code, I notified them
- [ ] CI is green (lint, build, secrets-scan)
- [ ] No `console.log` or debug code left behind

## Governance compliance

- [ ] I have read `AGENTS.md` and `docs/architecture.md`
- [ ] I have considered the decision-compliance skill's Phase 2 (compliance gate)
- [ ] If this PR sets precedent (new dep, new pattern, contradiction of a doc), I have noted it in the description above

## How to test

<!-- Steps a reviewer can follow to verify the change. -->

## Screenshots (if applicable)

<!-- UI changes only. -->