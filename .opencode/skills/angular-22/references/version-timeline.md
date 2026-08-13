# Angular version timeline (v17 → v22)

Purpose: models trained on ~v17/18 tend to treat *everything* signal-related as
brand-new and experimental. Much of it has been stable for 3+ years. This table
tells you exactly when each feature shipped, went stable, and (where relevant)
became the default — so you don't misjudge a project's version or call a
long-stable feature "new," and don't push a v22-only API onto an older codebase.

Angular release cadence: 6-month major versions through v21; **yearly majors
starting v22** (next major, v23, expected ~June 2027), with 4-6 minor releases
per major. Support window: 12 months active + 12 months LTS (24 months total).

## Core reactivity primitives

| Feature | Introduced | Stable / Default |
|---|---|---|
| `signal()`, `computed()`, `effect()` | v16 (developer preview) | Stable v17 |
| `input()` (signal inputs) | v17.1 | Stable v19 |
| Signal-based two-way binding / `model()` | v17.2 | Stable v19 |
| `output()` | v17.3 | Stable v19 |
| Signal queries: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()` | v17.2-18 | Stable v19 |
| `linkedSignal()` | v19 (experimental) | Stable v20 |
| `resource()`, `rxResource()` | v19 (experimental) | **Stable v22** |
| `httpResource()` | v19.2 (experimental) | **Stable v22** |
| `debounced()` (debounce any signal) | — | New, experimental in **v22** |

## Change detection & rendering

| Feature | Introduced | Stable / Default |
|---|---|---|
| Built-in control flow `@if`/`@for`/`@switch` | v17 (developer preview) | Stable v17.1, default schematic output since v17 |
| Deferrable views `@defer` | v17 (developer preview) | Stable v18 |
| Zoneless change detection (`provideZonelessChangeDetection`) | v18 (experimental) | Stable **v20.2**; **default for new apps since v21** |
| `ChangeDetectionStrategy.OnPush` as the framework default | — | **Default since v22** (old default renamed to `ChangeDetectionStrategy.Eager`) |
| `@let` template variable declaration | v18 | Stable v18 |
| `@switch` multi-case labels, `@default never` exhaustiveness check | — | New **v22** (basic `@default never` was v21.2; nested-property support added in v22) |
| Arrow functions in templates | — | New **v22** |
| Spread/rest syntax in templates | — | New **v22** |
| Comments inside HTML element tags | — | New **v22** |
| `@boundary` / `@error` template error boundaries | — | **Developer preview only, targeted for Q3 2026** — do not use as if it ships in v22.0/22.1 |

## Components & DI

| Feature | Introduced | Stable / Default |
|---|---|---|
| Standalone components/directives/pipes | v14 (developer preview) | Stable v15; **CLI default since v17**; `standalone: true` no longer needs to be written since **v19** (it's implicit) |
| `inject()` function | v14 | Stable, long-established idiom |
| NgModules | — | Still fully supported, but treated as **legacy for new code** since ~v19; no removal date announced. Existing large codebases still use them — don't assume every project has migrated. |
| `@Service()` decorator | — | New **v22** (shorthand for `@Injectable({ providedIn: 'root' })`; requires `inject()`, not constructor DI) |
| `injectAsync()` (lazy/async DI, code-splitting for services) | — | New **v22** |
| Selectorless components (import a component class and use it in a template without a string selector) | In active design/rollout around v21-v22 | **Verify current status before relying on this** — treat as emerging, not a settled baseline pattern, and confirm against live docs (`references/staying-current.md`) before teaching it as the default way to write templates |

## Forms

| Feature | Introduced | Stable / Default |
|---|---|---|
| Reactive Forms / Template-driven Forms + `ControlValueAccessor` | Angular 2+ | Still fully supported; being superseded, not removed |
| Signal Forms (`form()` from `@angular/forms/signals`, `FormValueControl`) | v21 (experimental) | **Stable v22** — recommended for new form code |
| `[field]` directive | v21.0 | Renamed to `[formField]` in v21.1 — `[field]` was removed |

## HTTP & Router

| Feature | Introduced | Stable / Default |
|---|---|---|
| `provideHttpClient()` required explicitly | — | No longer required — HTTP client is auto-provided in the root injector since v21 |
| `withFetch()` (Fetch API backend instead of XHR) | — | **Fetch is the default backend since v22**; `withFetch()` is now deprecated (a no-op you can delete); use `withXhr()` if you deliberately need the old XHR backend |
| `Router.isActive()` method | — | Deprecated v21.1 in favor of the tree-shakeable `isActive()` standalone function |
| `paramsInheritanceStrategy` | — | Default changed to `'always'` in **v22** (was `'emptyOnly'`) — breaking change, no auto-migration |
| `canMatch` guard signature | — | **v22**: mandatory third `currentSnapshot` parameter (auto-migrated) |
| `withExperimentalPlatformNavigation()`, `withExperimentalAutoCleanupInjectors()` | — | New, experimental, **v22** |

## Testing & tooling

| Feature | Introduced | Stable / Default |
|---|---|---|
| Vitest as test runner | v21 (available) | **Default for new projects since v21**; Karma/Jasmine still supported but legacy |
| `strictTemplates` | Long available, opt-in | **Enabled by default since v22** |
| Angular CLI MCP server (for AI agents) | v20.1 | Tools progressively stabilized through v21-v22.1 |
| Angular Agent Skills (`angular-developer`, `angular-new-app`) | — | Introduced **v22** — an official, actively-maintained alternative/complement to this document; see `references/staying-current.md` |
| `@angular/aria` (headless accessible UI primitives) | v21 (developer preview) | **Stable v22** |

**Rule of thumb:** if a feature is marked "stable" in a row above and the
project's `@angular/core` version is at or past that stable version, treat it as
the normal, boring, default way to do things — not as a cutting-edge choice worth
hedging about.
