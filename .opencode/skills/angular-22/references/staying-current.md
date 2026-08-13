# Staying current: this skill will go stale too

This skill was compiled **August 12, 2026**, against **Angular v22.1** (released
July 27, 2026). Angular now ships a **new minor roughly every 2 months** and a
**new major every June**. The next expected releases per the official schedule at
the time of writing: v22.2 (~Sept 2026), v22.3 (~Nov 2026), v22.4 (~Jan 2027),
v22.5 (~Mar 2027), v23.0 (~June 2027).

Treat everything in this skill as "true as of v22.1." For anything where being
current actually matters for the task — a specific API signature, whether a
feature is still experimental, exact deprecation timing — verify live instead of
trusting this document blindly, especially for:

- Anything marked "developer preview," "experimental," or a "sneak peek" in
  `references/whats-new-in-v22.md` (e.g. `@boundary`, selectorless components,
  WebMCP integration) — these are exactly the things most likely to have shipped,
  changed shape, or been cancelled since this was written.
- Any task involving a version newer than v22.1.
- Anything security- or breaking-change-related before telling someone it's safe.

## Where to look

| What you need | Where |
|---|---|
| Official docs, guides, API reference | https://angular.dev |
| What changed in a specific release | https://blog.angular.dev (search "Announcing Angular vNN") |
| Commit-by-commit changelog, exact deprecations | https://github.com/angular/angular/blob/main/CHANGELOG.md |
| All releases/tags | https://github.com/angular/angular/releases |
| Step-by-step migration between two specific versions | https://angular.dev/update-guide |
| Version support windows / current release schedule | https://angular.dev/reference/releases |
| Deep technical rundown of each release (community, very reliable, published same day) | https://blog.ninja-squad.com (search "what's new Angular NN") |
| Official, Angular-team-maintained agent skill (likely to be more current than this file) | https://github.com/angular/skills — install via `npx skills add https://github.com/angular/skills`; gives you `angular-developer` and `angular-new-app` |

## How to check what's actually installed

Don't infer the version from context or assume "latest." Check directly:

```bash
cat package.json | grep '"@angular/core"'
# or
npm ls @angular/core
```

## Good search queries if you have web access

- `"Angular vNN" release notes` — official announcement for a specific version
- `site:angular.dev <feature name>` — official docs for a specific API
- `Angular <feature> stable version` — when you need to know if something graduated
  from experimental/preview to stable
- `Angular update guide <from> to <to>` — for `angular.dev/update-guide`-style
  step-by-step migration instructions
- `Angular CHANGELOG deprecated <version>` — for an exact deprecation list

## A note on the official Angular Agent Skills

As of v22, the Angular team itself publishes and maintains official skills for
coding agents (`angular-developer`, `angular-new-app`) at
https://github.com/angular/skills, explicitly designed to solve the same problem
this skill solves — closing the gap between a model's training data and current
Angular. Where they're available and this document conflicts with them, prefer
the official skill; it's maintained by the people who ship the framework and
will be updated on every release. This document is a useful fallback and a more
narrative/explanatory companion, not a replacement for that source.
