# What's new in Angular v22 (deep dive)

Angular v22 was released **June 3, 2026** (minor v22.1 followed **July 27, 2026**).
It's a *consolidation* release: several multi-year signal-based efforts (Signal
Forms, Resource APIs, Angular Aria) graduate from experimental/preview to stable,
`OnPush` becomes the default change-detection strategy, and there's a large batch
of AI-agent tooling. Official sources: https://blog.angular.dev (search "Announcing
Angular v22"), https://angular.dev, changelog at
https://github.com/angular/angular/blob/main/CHANGELOG.md.

## 1. Stabilized APIs — safe to use in production now

### Signal Forms (`@angular/forms/signals`)

The new form-building API. Combines Reactive Forms' explicitness, Template-driven
forms' ergonomics, and Signals' reactivity.

```ts
import { signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-payment',
  imports: [FormField],
  templateUrl: './app-payment.html',
})
class Payment {
  readonly paymentModel = signal({ paymentType: '', amount: 0 });
  readonly f = form(this.paymentModel, schema => {
    required(schema.paymentType, { message: 'Required field' });
  });
}
```

```html
<select id="payment-type" [formField]="f.paymentType">
  <option value="">Select a method...</option>
</select>
@if (f.paymentType().invalid() && f.paymentType().touched()) {
  @for (error of f.paymentType().errors(); track error.kind) {
    <span>{{ error.message }}</span>
  }
}
<button type="submit" [disabled]="f().invalid()">Submit</button>
```

Key v22 API details (some are breaking changes vs. the v21 experimental version):

- **`touched`/`touch()` split**: custom controls can no longer bind directly to a
  writable `touched` model (that let a control un-touch a field, which was a
  design mistake). Now: a `touched` **input** to read touched state, a `touch()`
  **output** to mark touched. Update any custom control still using the old
  `touched` model binding.
- **`markAsTouched()`** now marks the field *and all descendants* touched by
  default. Pass `{ skipDescendants: true }` to get the old single-field behavior.
- **`when` option** is now the consistent way to make a validator/behavior
  conditional, replacing passing a bare reactive function as an argument. The old
  signature still works but is deprecated:
  ```ts
  // deprecated
  disabled(form.age, ({ valueOf }) => valueOf(form.isAdmin));
  // current
  disabled(form.age, { when: ({ valueOf }) => valueOf(form.isAdmin) });
  ```
- **`minDate()` / `maxDate()`** validators are new.
- **Debounce on blur**: `debounce(form.password, 'blur')` in addition to a
  millisecond delay.
- **`debounce` option on `validateAsync()`/`validateHttp()`** to debounce only the
  async validator, separate from debouncing the value itself.
- **`reloadValidation()`** re-runs async validators for a field and its
  descendants (equivalent of legacy `updateValueAndValidity()`).
- **`getError('kind')`** on a field — narrows the return type instead of manually
  scanning the `errors()` array.
- **`FormValueControl`** is the new interface for custom form controls (replaces
  `ControlValueAccessor` conceptually). It is bidirectionally compatible: existing
  `ControlValueAccessor` components work inside Signal Forms, and `FormValueControl`
  components work inside legacy Reactive/Template-driven forms (`formControlName`,
  `[(ngModel)]`) without changes. `FormValueControl` also supports a `reset` method.

### Resources — `resource()`, `rxResource()`, `httpResource()`

Stable, production-ready async-state primitives (the signal-friendly replacement
for manually managing loading/error/data state with RxJS + subscriptions).

```ts
import { resource, signal, computed } from '@angular/core';

const selectedCity = signal('Chicago');

const weatherResource = resource({
  params: () => ({ city: selectedCity() }),
  loader: ({ params }) => fetchWeatherForecast(params.city),
});

const currentTemperature = computed(() =>
  weatherResource.hasValue() ? `${weatherResource.value().temperature}°F` : 'Loading...'
);
```

```ts
weather = httpResource<{ temperature: number }>(() =>
  `https://api.example.com/v1/forecast/${this.selectedCity()}`
);
```

New in v22: **`chain()`**, exposed on the context passed to `params`/the request
function, lets one resource depend on another without manual plumbing:

```ts
const userResource = httpResource<{ authorId: number }>(() => `/api/users/${id()}`);

const postsResource = resource({
  params: ({ chain }) => {
    const user = chain(userResource);
    return user ? { authorId: user.authorId } : undefined;
  },
  loader: ({ params }) => fetchPostsByUserId(params.authorId),
});
```

`chain()` propagates idle/loading/error state from the source resource
automatically (errors surface as `ResourceDependencyError`). Resources can also
now be given an `id` for SSR caching, avoiding a redundant loading state on the
client after server rendering.

### Angular Aria (`@angular/aria`)

Twelve headless, accessible UI patterns (combobox, listbox, accordion, tree, etc.)
now stable and Signal-Forms-compatible, with test harnesses available. Bring your
own styles/business logic; Aria handles ARIA attributes and keyboard interaction.

## 2. Default behavior changes (these affect existing code)

### `OnPush` is now the default change-detection strategy

```ts
// This component is OnPush by default in v22 — no decorator needed
@Component({ selector: 'app-weather', template: `...` })
class Weather {}
```

The old "check-always" default is **not gone** — it's renamed
`ChangeDetectionStrategy.Eager` and must be specified explicitly if you want it:

```ts
@Component({
  selector: 'app-legacy',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `...`,
})
class LegacyCmp {}
```

`ng update` auto-migrates existing projects by adding
`changeDetection: ChangeDetectionStrategy.Eager` to every component that didn't
specify a strategy, so upgraded apps keep their old behavior until someone
opts a component into `OnPush` deliberately. **New code you write for a v22+
project needs neither `Default` nor `OnPush` written out — omission now means
`OnPush`.**

### HTTP client uses Fetch by default

`withFetch()` is deprecated (safe to delete — it's now a no-op default). If you
need the old XHR backend, use `withXhr()` explicitly. The only real capability
gap versus XHR is upload progress reporting — `reportProgress` is deprecated in
favor of separate `reportUploadProgress` / `reportDownloadProgress` options.

### Incremental hydration is the default SSR hydration strategy

`withIncrementalHydration()` is no longer necessary in `provideClientHydration()`
and is deprecated. If a project needs the old (non-incremental) strategy, it must
now opt out explicitly with `withNoIncrementalHydration()`.

### `strictTemplates` is on by default

No more setting it manually in `tsconfig.json` for the type-checking benefits.
`ng update` adds `strictTemplates: false` automatically to preserve old behavior
for upgraded projects that weren't already using it — but **new v22 projects get
strict template checking with no configuration.**

## 3. New APIs

### `@Service()` decorator

```ts
import { Service } from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];
  addData(item: string) { this.data.push(item); }
}
```

Shorthand for `@Injectable({ providedIn: 'root' })`. Requires `inject()` for its
own dependencies (no constructor injection). Use `@Injectable` when you need
constructor injection, non-root scope, or other configuration. `ng generate
service` now generates `@Service()` by default (`--injectable` flag falls back to
the old decorator). No automatic migration exists for pre-existing services.

### `injectAsync()`

Lazy/async dependency injection — code-splits a service so it's only downloaded
when actually used:

```ts
export class Report {
  private exporter = injectAsync(() => import('./report-exporter'));
  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

Supports prefetching: `injectAsync(() => import('./x'), { prefetch: onIdle })`
starts the download in the background (e.g. on browser idle) without forcing
eager use. The target service must be auto-provided (`@Service()` or
`@Injectable({ providedIn: 'root' })`).

## 4. Template & compiler changes

- **Comments inside element tags** are now valid:
  ```html
  <div
    // valid comment
    /* also valid, multi-line too */
    attr1="value1">
  </div>
  ```
- **Spread/rest syntax** works in object literals, array literals, and function
  calls in templates: `[class]="{...standardStyles, active: isActive}"`,
  `[items]="[...base, 'extra']"`, `{{ calc(...prices, tax) }}`.
- **`@switch` multiple case labels** can share a body (fallthrough-style, no
  duplication):
  ```html
  @switch (orderStatus) {
    @case ('Pending')
    @case ('Processing') { <p>In progress</p> }
    @default { <p>Unknown</p> }
  }
  ```
- **Exhaustiveness checking**: `@default never;` (simple discriminant) or
  `@default never(entity);` (nested property discriminant, new in v22) makes the
  compiler error if a union case is left unhandled.
- **Arrow functions in templates** are now allowed for short inline logic:
  ```html
  <button (click)="item.update(p => ({ ...p, stock: p.stock - 1 }))">Decrease</button>
  ```
  Keep them short — don't put real business logic in a template.
- **Optional chaining semantics changed to match TypeScript**: `project?.author`
  now returns `undefined` (not `null`) when `project` is nullish, and the
  compiler correctly narrows types after an `@if (project?.author)` guard so you
  can drop the redundant `?.` inside. A migration wraps existing optional-chain
  expressions in `$safeNavigationMigration()` to preserve old behavior during
  upgrade — these wrappers should be reviewed and removed where safe, not left in
  new code.
- **New compile-time errors**: multiple components matching the same element
  (`NG8023`) and duplicate input/output/model names via aliasing (`NG1054`) are
  now caught at compile time instead of failing at runtime.
- **Host directive de-duplication**: Angular now automatically de-dupes host
  directives matched multiple times on one element; template matches win over
  host-directive matches; duplicate input/output names across host directives
  now throw instead of silently conflicting.
- **`@defer (on idle(500ms))`**: the idle trigger now accepts a timeout so it
  doesn't wait forever for a real idle callback. `provideIdleServiceWith()` lets
  you supply a custom `IdleService` implementation.

## 5. Router changes

- `paramsInheritanceStrategy` now defaults to `'always'` (parent route params/data
  are inherited by child routes by default). **No automatic migration** — set it
  to `'emptyOnly'` explicitly if a project relies on the old behavior.
- `canMatch` guard functions now receive a mandatory third `currentSnapshot`
  parameter (auto-migrated by `ng update`).
- `RouterLink` gained a `browserUrl` input (feature originated v18) — lets a link
  navigate to one route while displaying a different URL in the browser bar.
- Experimental: `withExperimentalPlatformNavigation()` integrates the router with
  the browser's native Navigation API (auto scroll restoration, global loading
  hooks, a11y announcements, intercepts all navigations including plain `<a>`
  tags) — opt-in, not default.
- Experimental: `withExperimentalAutoCleanupInjectors()` auto-destroys
  route-level injectors when a route becomes inactive (memory-leak prevention);
  the team is soliciting feedback before making this the default.
- `destroyDetachedRouteHandle()` gives a public API to dispose of a component
  held by a custom `RouteReuseStrategy`'s detached handle, replacing the old
  `(handle as any).componentRef.destroy()` workaround.

## 6. Testing

- `TestBed.getLastFixture()` — grab the most recently created fixture without
  keeping a manual reference.
- Zone.js-based tests (`fakeAsync`, `flush`, `waitForAsync`) now work under
  Vitest via `zone.js/plugins/vitest-patch` in the polyfills — useful as an
  interim step while migrating off Zone.js entirely.
- CLI: `migrate-karma-to-vitest` schematic automates the Karma→Vitest setup
  migration; `refactor-jasmine-vitest` (existing) converts Jasmine tests, now
  with a `--fake-async` flag to convert `fakeAsync` tests to Vitest's
  `vi.useFakeTimers()` / `vi.advanceTimersByTimeAsync()`.
- `unit-test` builder gained `quiet` (suppress build summary/stats) and
  `--isolate` (native Vitest test isolation via threads/processes) options.

## 7. Security hardening (SSR-relevant)

v22 is also a security release for `platform-server`: guards against SSRF and
path hijacking in server-side URL/location handling, rejects suspicious and
protocol-relative URLs, closes SSRF bypasses via backslash URLs in `HttpClient`,
and adds stricter sanitization (dynamic `href`/`xlink:href` on SVG `<a>`, `meta`
selectors, placeholder values, namespaced tag names). Mostly automatic — relevant
mainly to know it happened, not something to hand-code around.

## 8. AI/agent tooling (relevant to you as an agent)

- The Angular CLI's MCP server gained `devserver.start`, `devserver.stop`, and
  `devserver.wait_for_build` tools (build-and-inspect-output loop for
  self-healing agent workflows), graduating to stable alongside testing/e2e
  tools in v22 (some tools finished stabilizing in v22.1).
- Official **Angular Agent Skills** (`angular-developer`, `angular-new-app`) were
  introduced at https://github.com/angular/skills — install with
  `npx skills add https://github.com/angular/skills`. `angular-developer` is a
  living, officially-maintained skill covering current best practices, updated
  by the Angular team itself — treat it as a complementary, likely more
  up-to-date source alongside this skill, and prefer it where the two conflict.
- Experimental **WebMCP** support: `declareExperimentalWebMcpTool()` /
  `provideExperimentalWebMcpTool()` let an Angular app expose MCP tools directly
  from the running page; `provideExperimentalWebMcpForms()` auto-generates a
  WebMCP tool from a Signal Form. Early/experimental — don't present as a stable
  pattern.

## 9. Explicitly NOT available yet (don't hallucinate these as shipped)

- **`@boundary` / `@error` template error boundaries** — announced as a "sneak
  peek," targeted for **developer preview in Q3 2026**. Not in v22.0 or v22.1.
  Don't generate this syntax as if it works today; verify current status first.
- **Selectorless components** — in active design/rollout; confirm current status
  via `references/staying-current.md` before treating it as a settled default
  pattern for writing templates.

## 10. Toolchain / deprecation notes

- Requires **TypeScript 6** (5.9 and earlier unsupported) and **Node.js ≥22**
  (Node 20 support dropped; Node 26 supported).
- **Webpack-based builders are deprecated** in v22: `@angular-devkit/build-angular`
  webpack builders and `@ngtools/webpack`. The team is focusing on the
  esbuild-based application builder (with TSGo support in progress). Don't
  scaffold new webpack-based Angular build configs.
- Chunk optimization for lazy-loading (`NG_BUILD_OPTIMIZE_CHUNKS`, introduced
  v18.1) is **on by default in production builds** now; the env var now
  disables it (`=0`) or tunes its threshold instead of enabling it.
- The bundler defaults back to Rollup (Rolldown, introduced experimentally in
  v20.2, remains available opt-in via `NG_BUILD_CHUNKS_ROLLDOWN`).

## v22.1 (July 27, 2026) highlights

- Confirmed the shift to a **yearly major release cadence** starting v22 (next
  major, v23, ~June 2027).
- MCP tools `run_target`, `devserver.start`, `devserver.stop`,
  `devserver.wait_for_build` promoted from experimental to stable/default.
- HTTP interceptors are now automatically `untracked()` inside `effect()`, fixing
  effects that unexpectedly re-ran due to signals read inside interceptors.
- `linkedSignal` accepts a custom setter, allowing writes to flow back to the
  source signal.
- JSONP backend now warns in dev mode that it's slated for future removal.
