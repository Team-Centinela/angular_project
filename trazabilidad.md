# Trazabilidad — Cambios realizados

Registro auditado del trabajo hecho en cada issue, con qué se hizo, dónde y por qué. Lo escriben y mantienen los integrantes del equipo para tener memoria de las decisiones y poder responder rápido cuando un cambio toca algo que ya estaba hecho.

**Convención de entrada:** cada cambio tiene el mismo formato — *qué*, *dónde*, *por qué* — y referencia la PR que lo mergeó. Mantener entradas cortas y concretas.

---

## Issue #9 — Crear página Home

- **Día:** Lunes
- **Rama:** `feat/issue-9-home` (la versión inicial `feat/issue-9-home-page` quedó obsoleta por force-push de develop)
- **PR mergeada:** [#52](https://github.com/Team-Centinela/angular_project/pull/52) (cerrada) + re-aplicada en #56 → mergeada en `8ec1b64 chore: apply review feedback to ProductCard and Home`
- **Issue:** [#9](https://github.com/Team-Centinela/angular_project/issues/9)

### Qué
Página principal `HomeComponent` con: grid de productos, barra de búsqueda, filtro por categorías, indicador de carga, estado vacío, ruta `''` registrada en `app.routes.ts`.

### Dónde

| Archivo | Rol |
|---|---|
| `frontend/src/app/pages/home/home.component.ts` | Standalone, signals para `products` y computed para `filteredProducts` |
| `frontend/src/app/pages/home/home.component.html` | `@for`, `@if`, `[ngModel]+(ngModelChange)` |
| `frontend/src/app/pages/home/home.component.scss` | Grid responsive + estilos de filtros |
| `frontend/src/app/app.routes.ts` | Ruta `''` → `HomeComponent` |

### Por qué
- **Mocks hardcodeados** porque la conexión real a la API es la issue #23 (martes, depende del service #25). Poner la llamada ahora significaba crear también el service fuera de turno.
- **`signal` + `computed`** (no `get` recálculado en cada change detection) — agregado tras el review que detectó que `computed` no trackeaba propiedades planas.
- **`@Input`/`@Output` clásico** en ProductCard (no signals) por familiaridad.
- **Botón accesible** en ProductCard tras el review (no `<article>` clickeable).
- **`currency:'COP':'symbol-narrow':'1.0-0'`** alineado con la página de Products CRUD.

---

## Issue #10 — Crear componente `ProductCard`

- **Día:** Lunes
- **Rama:** `feat/issue-10-product-card` (versión final integrada en `feat/apply-review-feedback`)
- **PR mergeada:** [#50](https://github.com/Team-Centinela/angular_project/pull/50) (cerrada) + consolidada en #56 → mergeada en `8ec1b64`
- **Issue:** [#10](https://github.com/Team-Centinela/angular_project/issues/10)

### Qué
Componente standalone `ProductCardComponent` reutilizable: input `@Input() product`, output `@Output() productClick: EventEmitter<string>`. Muestra imagen/placeholder, nombre, categoría, precio.

### Dónde

| Archivo | Rol |
|---|---|
| `frontend/src/app/components/ui/product-card/product-card.component.ts` | `@Input()`, `@Output()`, `onClick()` |
| `frontend/src/app/components/ui/product-card/product-card.component.html` | `<button type="button">` con `@if` para imagen |
| `frontend/src/app/components/ui/product-card/product-card.component.scss` | Estilos con `&:focus-visible` para a11y |

### Por qué
- **Standalone + `inputs/outputs` clásico** por simplicidad para principiantes.
- **`<button type="button">`** (no `<article (click)>`) tras review: foco por teclado, detectable por screen reader.
- **`CommonModule` ya provee `CurrencyPipe`** — no hace falta import extra.
- **`@if (product.images && product.images.length > 0)`** con placeholder — el modelo permite imágenes vacías.

---

## Bug fix #56 — `searchText`/`selectedCategory` no eran signals

- **PR:** [#56](https://github.com/Team-Centinela/angular_project/pull/56) — últimos commits después del review
- **Merge:** `8ec1b64 chore: apply review feedback to ProductCard and Home`

### Qué
El reviewer detectó que `computed()` no recompilaba al tipear porque leía `searchText`/`selectedCategory` como **propiedades planas**, no como signals.

### Fix
- `searchText: string = ''` → `readonly searchText = signal('')`
- `selectedCategory: string = ''` → `readonly selectedCategory = signal('')`
- `[(ngModel)]="searchText"` → `[ngModel]="searchText()"` + `(ngModelChange)="searchText.set($event)"`
- Quitados `name="search"` / `name="category"` (innecesarios fuera de `<form>`).

### Por qué `signal('')` y no `model('')`
`model()` está pensado para two-way binding entre componentes (`[(childProp)]`); mezclarlo con `[(ngModel)]` dentro del mismo template no es 100% estándar. El patrón `[ngModel] + (ngModelChange)` es explícito y siempre funciona.

---

## Issue #60 — Integrar `<app-product-card>` en Home

- **Día:** Lunes
- **Rama:** `feat/issue-60-integrate-product-card`
- **PR:** [#64](https://github.com/Team-Centinela/angular_project/pull/64)
- **Issue:** [#60](https://github.com/Team-Centinela/angular_project/issues/60)

### Qué
Refactor de Home para usar `ProductCardComponent` en vez del `<article class="card">` inline. Elimina la duplicación de estilos de card que quedaba entre los dos archivos.

### Dónde

| Archivo | Cambio |
|---|---|
| `frontend/src/app/pages/home/home.component.ts` | Importa `ProductCardComponent`, lo agrega a `imports`, define `onProductClick(id)` |
| `frontend/src/app/pages/home/home.component.html` | `@for` renderiza `<app-product-card [product]="p" (productClick)="onProductClick($event)">` |
| `frontend/src/app/pages/home/home.component.scss` | Quita estilos `.card` (muertos: ya no se renderizan acá) |

### Por qué
- **Cierra el follow-up obligatorio del reviewer de #56** — sin esto, quedaban dos estilos de card coexistiendo.
- **`onProductClick` con `console.log`** porque `/products/:id` no existe todavía (issue #27, miércoles). Una línea de reemplazo cuando se cree el detalle.
- **`@for` mantiene `track p.id`** — el signal `filteredProducts` devuelve el array nuevo, Angular trackea por id para reusar nodos DOM.

---

## Convenciones (para que cada entrada se vea igual)

- *Qué:* bullets cortos, máximo 4-5 puntos
- *Dónde:* tabla con `archivo → rol del cambio`
- *Por qué:* las decisiones de diseño que no están en el commit message — por qué mock, por qué signal, por qué este formato de pipe, etc.

Cada PR que toque un comportamiento nuevo debería agregar una entrada acá en el mismo PR (o como commit aparte). Las PRs que sólo tocan estilo o refactor sin cambio de comportamiento pueden obviarse.
