# Technical Requirements

Source of truth for all mandatory technical requirements that must be complied with throughout the project.

## Pages (Components)

| Page | Route | Protection |
|------|-------|------------|
| Home | `/` | Public |
| Product Detail | `/products/:id` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Products | `/products` | Protected |
| Categories | `/categories` | Protected |
| Favorites | `/favorites` | Protected |
| Profile | `/profile` | Protected |

## Reusable Components

| Component | Type | Description |
|-----------|------|-------------|
| Navbar | Layout | Main navigation |
| Sidebar | Layout | Side navigation |
| Footer | Layout | Page footer |
| ProductCard | UI | Product display card |
| Loading | UI | Loading indicator |
| SearchBar | UI | Product search input |

## Angular Concepts

### Data Binding
- [ ] Property Binding `[property]="value"`
- [ ] Event Binding `(event)="handler()"`
- [ ] Two-way Binding `[(ngModel)]`
- [ ] String Interpolation `{{ expression }}`

### Control Flow Directives
- [ ] `@if` with `else` support
- [ ] `@for` with `track` property
- [ ] `@switch` / `@case` when applicable

### Pipes
- [ ] `currency` pipe
- [ ] `date` pipe
- [ ] Any other built-in pipe as needed

### Dependency Injection
- [ ] Use `inject()` function for services
- [ ] Proper service providers in components

## Services

All HTTP communication must live in services:

- [ ] `AuthService` - Authentication (login, register, logout, JWT handling)
- [ ] `ProductService` - Product CRUD operations
- [ ] `CategoryService` - Category CRUD operations

## Routing

- [ ] Angular Router for all navigation
- [ ] Route configuration in `app.routes.ts`
- [ ] Lazy loading for performance (bonus)

## Security

### Auth Guard
- [ ] Protect routes: `/products`, `/categories`, `/favorites`, `/profile`
- [ ] Redirect to `/login` when no JWT is present
- [ ] Allow access to public routes when authenticated (optional redirect)

### HTTP Interceptor
- [ ] Automatically add `Authorization: Bearer <token>` to requests
- [ ] Handle `401 Unauthorized` by clearing JWT and redirecting to login
- [ ] No manual header writing in services or components

## Error Handling

| Status Code | Action |
|-------------|--------|
| 400 | Show validation message to user |
| 401 | Clear JWT, redirect to `/login` |
| 404 | Inform user resource not found |
| 409 | Show conflict message (duplicates) |

- [ ] All API errors displayed to user (no console logging only)
- [ ] Loading states visible during HTTP requests
- [ ] Empty states handled gracefully

## Code Standards

- [ ] Small, reusable components
- [ ] Clear method and variable naming
- [ ] Separation of Pages (route components) and Components (reusable)
- [ ] No manual DOM manipulation (`document.getElementById`, etc.)
- [ ] TypeScript interfaces for data models
- [ ] Consistent code style throughout

## File Structure

```
src/app/
├── pages/                  # Route page components
│   ├── home/
│   ├── login/
│   ├── register/
│   ├── products/
│   ├── categories/
│   ├── favorites/
│   └── profile/
├── components/             # Reusable components
│   ├── layout/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   └── footer/
│   └── ui/
│       ├── product-card/
│       ├── loading/
│       └── search-bar/
├── services/              # API services
├── guards/                # Route guards
├── interceptors/          # HTTP interceptors
├── models/                # TypeScript interfaces
└── app.routes.ts
```

## Bonus (Not Required)

These are NOT required but will earn bonus points:

- [ ] NgRx or Redux for state management
- [ ] Reactive Forms instead of template-driven
- [ ] Refresh Tokens implementation
- [ ] Lazy Loading of routes
- [ ] Unit Tests — bootstrapped in #113 as a *bonus* item via PR #118 (Jest + jest-preset-angular). Promotion from Bonus to a sprint requirement needs team ratification (see `docs/architecture.md` §"Decisions log", PROPOSED entry 2026-08-14).
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Animations
- [ ] Complex architectures (DDD, Clean, Hexagonal)
