# Deprecated & legacy patterns to avoid (with replacements)

This is the "if you're about to write this, stop" list. For each item: what it
is, why it's outdated, what to write instead, and since when. Most of these still
*work* (Angular rarely removes things fast), so this isn't about broken code —
it's about not generating code that reads as stale to anyone reviewing it against
a current codebase.

## Templates

| Legacy | Replace with | Since |
|---|---|---|
| `*ngIf="cond"` | `@if (cond) { ... } @else { ... }` | v17 |
| `*ngFor="let x of items; trackBy: fn"` | `@for (x of items; track x.id) { ... } @empty { ... }` | v17 |
| `*ngSwitch` / `*ngSwitchCase` / `*ngSwitchDefault` | `@switch (val) { @case (x) {...} @default {...} }` | v17 |
| `NgIf`, `NgFor`, `NgSwitch` directives imported into `imports: []` just to use structural directive syntax | Not needed at all when using `@if`/`@for`/`@switch` — they're built into the template compiler | v17 |
| Introducing a template-local variable via a wrapping `<ng-container *ngIf="x as y">` hack | `@let y = x;` | v18 |

Structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) are **not removed** and
still work for custom directives with `structural: true`-style APIs, but for
*control flow in your own templates*, the built-in blocks are the current,
recommended, more performant approach (they compile to more efficient instructions
and don't need `CommonModule`/directive imports).

## Components: inputs, outputs, queries

| Legacy | Replace with | Since |
|---|---|---|
| `@Input() foo: string;` | `foo = input<string>();` or `input.required<string>()` | Stable v19 |
| `@Input() @Output()` pair simulating two-way binding | `foo = model<string>();` | Stable v19 |
| `@Output() foo = new EventEmitter<T>();` | `foo = output<T>();` | Stable v19 |
| `@ViewChild(X) x!: X;` | `x = viewChild(X);` (or `viewChild.required(X)`) | Stable v19 |
| `@ViewChildren(X) xs!: QueryList<X>;` | `xs = viewChildren(X);` | Stable v19 |
| `@ContentChild` / `@ContentChildren` | `contentChild()` / `contentChildren()` | Stable v19 |
| Reacting to input changes via `ngOnChanges` | `computed()` derived from the input signal, or `effect()` if a side effect is truly needed | — |

Decorator-based `@Input()`/`@Output()` still compile and interoperate fine with
signal-based siblings, but new code in a v19+ project should default to the
signal functions — that's what `ng generate component` and current style guides
produce.

## Dependency injection

| Legacy | Replace with | Since |
|---|---|---|
| `constructor(private http: HttpClient, private router: Router) {}` | `private readonly http = inject(HttpClient); private readonly router = inject(Router);` field initializers | `inject()` long-established |
| `@Injectable({ providedIn: 'root' })` as the default way to write a plain root-provided service | `@Service()` | v22 |
| Manually calling `ComponentFactoryResolver.resolveComponentFactory(X)` then `vcr.createComponent(factory)` | `vcr.createComponent(X)` directly (factories removed from the public API years ago) | Long since removed |
| `platformBrowserDynamic().bootstrapModule(AppModule)` | `bootstrapApplication(AppComponent, appConfig)` | Standalone bootstrapping is the standard entry point since standalone became default |

`@Service()` requires `inject()` for the service's own dependencies — it doesn't
support constructor injection. If a service needs constructor injection or a
non-root provider scope, keep using `@Injectable`.

## Change detection

| Legacy | Replace with | Since |
|---|---|---|
| Explicitly writing `changeDetection: ChangeDetectionStrategy.Default` | Nothing needed for OnPush behavior (it's the default now); use `ChangeDetectionStrategy.Eager` only if you deliberately want check-always behavior | v22 default flip |
| Assuming a component re-renders after any async callback because "Zone.js will catch it" | Assume zoneless: mutate signals, or in edge cases call things that explicitly notify Angular — don't rely on ambient Zone.js patching | Zoneless default since v21 |
| Manually calling `provideZonelessChangeDetection()` to "enable" zoneless in a brand-new v21+ project | Not needed — it's already the default; only relevant when explicitly opting an *older* project in | v21 default |

## Forms

| Legacy | Replace with | Since |
|---|---|---|
| Writing a new custom form control against `ControlValueAccessor` (`writeValue`, `registerOnChange`, `registerOnTouched`) | Implement `FormValueControl` instead — it's compatible with both Signal Forms and legacy Reactive/Template-driven forms, so you don't lose backward compatibility by switching | Recommended since v22 stabilization |
| Binding a custom control's `touched` state via a writable model | `touched` **input** + `touch()` **output** | v22 (breaking change from v21 experimental Signal Forms) |
| Passing a bare function as the second argument to `disabled()`/`readonly()`/`hidden()` etc. | Wrap it in `{ when: fn }` | v22 (old form deprecated, still works) |
| `updateValueAndValidity()` to force async validators to re-run | `reloadValidation()` on the field | v22 |
| Iterating `field().errors()` to find one kind of error | `field().getError('kind')` | v22 |

Reactive Forms and Template-driven Forms (`FormGroup`, `FormControl`,
`[(ngModel)]`) are **not deprecated or removed** — they're fully supported. Signal
Forms is the *new recommended default for new form code*, not a mandatory
migration for existing forms.

## HTTP

| Legacy | Replace with | Since |
|---|---|---|
| `HttpClientModule` in an `imports` array | `provideHttpClient()` in app config — and as of v21, not even that: HTTP client is auto-provided in the root injector | v21 |
| Explicit `withFetch()` | Nothing needed — Fetch is the default backend; `withFetch()` is now a deprecated no-op | v22 |
| `reportProgress: true` | `reportUploadProgress` / `reportDownloadProgress` (separate options; upload progress isn't available under the Fetch backend) | v22 |
| `Router.isActive(url, options)` method | `isActive(url, router, options)` standalone tree-shakeable function | Deprecated v21.1 |

## SSR / hydration

| Legacy | Replace with | Since |
|---|---|---|
| `withIncrementalHydration()` to opt in | Nothing needed — it's the default; use `withNoIncrementalHydration()` to opt *out* | v22 |

## Testing

| Legacy | Replace with | Since |
|---|---|---|
| Karma + Jasmine as the default new-project test setup | Vitest (`ng test` uses it out of the box in new v21+ projects) | v21 default |
| Keeping a manual `let fixture` variable just to retrieve it later in a test | `TestBed.getLastFixture()` | v22 |

Karma/Jasmine remain fully supported for existing projects — this is a "new
default," not a removal. Don't tell a team on Karma they're broken; do tell them
Vitest is now the default for new work and there's a `migrate-karma-to-vitest`
schematic if they want to move.

## Architecture

| Legacy | Replace with | Since |
|---|---|---|
| Creating a new `@NgModule` to organize a new feature | Standalone components/directives/pipes with their own `imports: []`; use plain TS modules/barrel files for organization instead | Standalone default since v17 (CLI), recommended pattern since ~v19 |
| `standalone: true` written explicitly on every component | Omit it — standalone is implicit/default since v19 | v19 |
| Scaffolding a new Angular build config on webpack (`@ngtools/webpack`, custom webpack builders) | The esbuild-based application builder (`@angular/build:application`, `ng build`/`ng serve` defaults) | Deprecated in v22 |

**Important nuance:** none of this means NgModules are gone or that you should
mass-refactor a stable production app just because it predates these changes.
Existing large codebases legitimately still run on NgModules, Karma, or
`ControlValueAccessor` — that's normal and supported. The point of this list is:
when *writing new code* or when asked to *modernize/review* code, don't default
to the old patterns as if they were still the current idiom.
