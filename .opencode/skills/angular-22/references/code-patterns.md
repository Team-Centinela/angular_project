# Modern Angular (v22) code patterns — copy-paste-correct skeletons

Use these as ground truth for syntax instead of reconstructing from memory.
All examples assume a v21+/v22 project (standalone implicit, zoneless, OnPush
default). If the target project is older, check `references/version-timeline.md`
before using a v22-only API (`@Service`, stable Signal Forms, etc.).

## A component, start to finish

```ts
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-card',
  imports: [/* other standalone components/directives/pipes used in the template */],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
  // No changeDetection line needed — OnPush is the default in v22.
  // Only add this if you deliberately want the old check-always behavior:
  // changeDetection: ChangeDetectionStrategy.Eager,
})
export class UserCard {
  private readonly userService = inject(UserService);

  // Inputs/outputs as signal functions, not decorators
  readonly userId = input.required<string>();
  readonly selected = model(false); // two-way bindable
  readonly deleted = output<string>();

  // Derived state
  protected readonly user = computed(() => this.userService.findById(this.userId()));
  protected readonly displayName = computed(() => this.user()?.name ?? 'Unknown');

  protected delete() {
    this.deleted.emit(this.userId());
  }
}
```

```html
<!-- user-card.html -->
@if (user(); as u) {
  <h3>{{ displayName() }}</h3>
  @for (tag of u.tags; track tag) {
    <span class="tag">{{ tag }}</span>
  } @empty {
    <span class="tag tag--none">No tags</span>
  }
  <button (click)="delete()">Remove</button>
} @else {
  <p>Loading user...</p>
}
```

## A service

```ts
import { Service, inject } from '@angular/core';
import { httpResource } from '@angular/core';

@Service() // root-provided singleton, shorthand for @Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = '/api/users';

  findAll() {
    return httpResource<User[]>(() => this.base);
  }
}
```

If the service needs constructor injection or non-root scope, use `@Injectable`
instead — `@Service()` only supports `inject()`-based dependencies.

## Async data with `resource()` / `httpResource()`

```ts
import { httpResource, signal } from '@angular/core';

export class WeatherPanel {
  readonly city = signal('Chicago');

  readonly forecast = httpResource<Forecast>(() =>
    `https://api.example.com/v1/forecast/${this.city()}`
  );
}
```

```html
@if (forecast.isLoading()) {
  <p role="status">Loading forecast…</p>
} @else if (forecast.error(); as err) {
  <p role="alert">Couldn't load forecast: {{ err.message }}</p>
} @else if (forecast.hasValue()) {
  <p>{{ forecast.value().temperature }}°F</p>
}
```

Chaining one resource off another:

```ts
const userResource = httpResource<{ authorId: number }>(() => `/api/users/${id()}`);

const postsResource = httpResource(({ chain }) => {
  const user = chain(userResource);
  return user ? `/api/posts?authorId=${user.authorId}` : undefined;
});
```

## A basic Signal Form

```ts
import { signal } from '@angular/core';
import { form, required, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  templateUrl: './signup.html',
})
export class Signup {
  readonly model = signal({ email: '', password: '' });

  readonly f = form(this.model, schema => {
    required(schema.email, { message: 'Email is required' });
    required(schema.password, { message: 'Password is required' });
    minLength(schema.password, 8, { message: 'At least 8 characters' });
  });

  submit() {
    if (this.f().invalid()) return;
    // this.model() has the current, validated value
  }
}
```

```html
<form (submit)="submit()">
  <input [formField]="f.email" type="email" />
  @if (f.email().touched() && f.email().invalid()) {
    @if (f.email().getError('required')) {
      <span class="error">Email is required</span>
    }
  }

  <input [formField]="f.password" type="password" />

  <button type="submit" [disabled]="f().invalid()">Sign up</button>
</form>
```

## A custom form control (`FormValueControl`)

```ts
import { Component, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-rating',
  template: `...`,
})
export class Rating implements FormValueControl<number> {
  readonly value = model(0);
  readonly touched = input(false);
  readonly touch = output<void>();

  reset() {
    this.value.set(0);
  }
}
```

This works both in Signal Forms (`[formField]="f.rating"`) and in legacy forms
(`formControlName="rating"` or `[(ngModel)]="rating"`) without changes.

## Injecting a service lazily

```ts
export class Admin {
  private readonly reportService = injectAsync(() =>
    import('./report.service').then(m => m.ReportService)
  );

  async exportPdf() {
    const reportService = await this.reportService();
    await reportService.exportPdf();
  }
}
```

With prefetching on browser idle:

```ts
private reportService = injectAsync(
  () => import('./report.service').then(m => m.ReportService),
  { prefetch: onIdle }
);
```

## Deferrable views

```html
@defer (on viewport) {
  <heavy-chart [data]="data()" />
} @placeholder {
  <div class="chart-skeleton"></div>
} @loading (minimum 200ms) {
  <spinner />
} @error {
  <p>Couldn't load chart.</p>
}
```

```html
@defer (on idle(500ms)) {
  <analytics-widget />
}
```

## Bootstrapping (no NgModules)

```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig);
```

```ts
// app.config.ts
import type { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // provideHttpClient() no longer strictly required (auto-provided in root)
    // but still fine to be explicit if you need withXhr(), interceptors, etc.
  ],
};
```

No `@NgModule`, no `platformBrowserDynamic`, no `zone.js` polyfill needed for a
new v21+ project.
