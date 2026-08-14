# Traceability — integrante-5 (3105jero / Jero)

Documento de trazabilidad del trabajo realizado durante el sprint, separado
por cada commit. Para cada commit se explica **qué** se hizo, **por qué** se
hizo y **cómo** se implementó, con el objetivo de reconstruir el contexto si
se necesita revisar, revertir o extender el trabajo.

> **Convención:** los hashes se muestran con prefijo corto (7 caracteres). Cada
> commit incluye un bloque "Aplicable a" con las issues que afecta. Algunos
> commits de la FASE 1 fueron revertidos mediante `git reset --hard` y
> `git push --delete`, así que ya **no existen** en el remoto; se documentan
> igual para dejar registro de qué se intentó y por qué se descartó.

---

## Resumen del flujo general

| Fase | Periodo | Qué pasó | Estado final |
|------|---------|----------|--------------|
| 1 | Primer intento | Crear archivos en `main` (que estaba atrás de `develop`); 6 branches + 6 merges a `main`; 6 PRs contra `develop` | **Revertido** |
| 2 | Limpieza | Cerrar PRs, borrar branches (local y remoto), resetear `main` y `develop` a sus versiones remotas, soltar el stash | **Hecho** |
| 3 | Reintento adaptado | Pull de `develop`, identificación de convenciones del equipo (DTOs en `*.dto.ts`, sufijo `.component.ts`, `string` para fechas), nueva implementación de #25 | **Mergeado** |
| 4 | Servicios #25/#30 + páginas #16/#17 | Reviews de @SrLampi1001, fix de limit, Favorite model, takeUntilDestroyed, helper compartido, mini-PR #55 con provideHttpClient | **Mergeado** |
| 5 | Rebase + nuevas páginas | Equipo mergea mis 5 PRs; yo rebaseo todo sobre nuevo develop y agrego Favorites (#18) reusando ProductCard | **#18 mergeado, #19 pendiente** |
| 6 | Pendiente | #19 (Profile page) | **Por hacer** |

---

## FASE 1 — Primer intento (revertido)

### Commit `e65cfea` (develop local, sin push)

**Aplicable a:** documentación transversal, sin issue específica.

**Qué hice:** Agregué una sección "Bitácora de integrante-5" al archivo
`sebastian-log.md` de Sebastian, documentando las 8 issues con el mismo
formato que él (Qué hice / Dónde / Por qué / Pendiente relacionado / Cómo
probar).

**Por qué:** Sebastian había establecido el archivo como bitácora compartida
("Cualquier compañero puede editar y agregar entradas") y el usuario pidió
añadir ahí todo lo que yo hice.

**Cómo:** `git checkout develop` + `Edit` (append) sobre
`sebastian-log.md` + `git commit -m "docs(log): add integrante-5..."`.
Añadí también una sección final "Reconciliación pendiente con develop"
porque al momento de empujarlo noté que `develop` ya tenía archivos
que yo no había visto.

**Estado final:** descartado cuando `origin/develop` recibió un force-push
que eliminó `sebastian-log.md` del remoto. `git reset --hard origin/develop`
lo eliminó del local.

---

### Commits en `main` (12 commits, todos revertidos)

Eran las 6 ramas feature mergeadas a `main` con `--no-ff`. Cada una con
un commit de feature y un commit de merge. Resumen:

| Commit | Issue | Título | Archivos |
|--------|-------|--------|----------|
| `169e793` (merge `de7e5d8`) | #25 | feat(services): add ProductService and CategoryService | `models/{product,category}.model.ts`, `services/{product,category}.service.ts` |
| `7dd3c3b` (merge `4cbf5f1`) | #30 | feat(services): add FavoritesService and UserService | `models/user.model.ts`, `services/{favorites,user}.service.ts` |
| `da4a75e` (merge `c628332`) | #16, #32 | feat(pages): add Products CRUD page | `pages/products/products.page.{ts,html,css}` |
| `1315b38` (merge `1c964c6`) | #17, #33 | feat(pages): add Categories CRUD page | `pages/categories/categories.page.{ts,html,css}` |
| `4a6d44b` (merge `e2d6902`) | #18 | feat(pages): add Favorites page | `pages/favorites/favorites.page.{ts,html,css}` |
| `ecd5b2f` (merge `c7e3561`) | #19 | feat(pages): add Profile page | `pages/profile/profile.page.{ts,html,css}` |

### Patrón común: por qué se descartó todo

1. **`main` estaba muy atrás de `develop`.** Mi base era
   `1dfed5f Add project description (gistfile1.md)`, mientras que
   `origin/develop` ya tenía 6 commits con el proyecto Angular 18
   completo (`frontend/angular.json`, `frontend/package.json`, los modelos
   del integrante-1, etc.).
2. **Conflictos de naming:**
   - Yo usé `models/product.model.ts`, pero el equipo ya tiene
     `models/product.ts` (creado por integrante-1).
   - Yo usé `pages/products/products.page.ts`, pero Sebastian usa
     `home.component.ts`.
   - Las fechas en mis interfaces eran `Date`, en las del equipo eran
     `string`.
3. **Push a `develop` generó 6 PRs** (#39-#44) con merge conflicts en
   `frontend/` entero, difíciles de resolver automáticamente.
4. **El equipo decidió simplificar `develop`** (force-push eliminando
   `sebastian-log.md` y reduciendo la superficie), confirmando que mi
   enfoque no encajaba con el estado actual del equipo.

**Decisión final del usuario:** "devolver lo que hicimos, mejor trabajar
con lo que ellos pongan".

### Stash (nunca aplicado, luego soltado)

`stash@{0}: On main: WIP: agregar comentarios a archivos de integrante-5`
contenía 19 archivos modificados con JSDoc, comentarios de sección e
inline. Se descartó con `git stash drop` durante la limpieza porque
la base sobre la que se aplicaría (`main` con mis merges) ya no existía
localmente.

---

## FASE 2 — Limpieza (sin commits)

Acciones ejecutadas en orden para llevar el repo al estado del equipo:

1. **Cerrar PRs** #39-#44 con un comentario en cada uno ("Cerrando este PR
   para reorganizar el trabajo. El equipo está preparando los archivos
   comunes y volveré a abrir los PRs cuando estén listos.").
2. **Borrar branches remotas** con `git push origin --delete feat/issue-25-...
   feat/issue-30-... feat/issue-16-... feat/issue-17-... feat/issue-18-...
   feat/issue-19-...`. Salida: `- [deleted]` para cada una.
3. **Reset local de `develop`** con `git reset --hard origin/develop`
   (descartó `e65cfea`).
4. **Reset local de `main`** con `git reset --hard origin/main` (descartó
   los 12 commits).
5. **Borrar branches locales** con `git branch -D feat/issue-*` (6 ramas).
6. **Soltar el stash** con `git stash drop stash@{0}`.

**Resultado:** working tree limpio, `main = 1dfed5f`, `develop = e71150a`,
sin PRs abiertos del usuario, sin ramas locales ni remotas propias.

---

## FASE 3 — Reintento adaptado (mergeado)

### Inspección de `develop` (precommit)

Antes de empezar a generar código, revisé lo que el equipo ya tenía en
`develop` para alinear convenciones:

```
frontend/
├── angular.json
├── package.json
├── tsconfig.json
├── proxy.conf.json           ← el equipo YA preparó el proxy (#26)
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app.component.{ts,html,scss}
│       ├── app.config.ts
│       ├── app.routes.ts     ← vacío, esperando las rutas
│       └── models/
│           ├── product.ts    ← con Product, ProductImage, fechas string
│           ├── category.ts   ← con Category
│           └── user.ts       ← con User
```

### Convenciones identificadas

| Decisión | Convención adoptada | Razón |
|---|---|---|
| Sufijo de modelos | `models/<name>.ts` | El equipo ya tiene `product.ts`, `category.ts`, `user.ts` |
| Mapeo de fechas | `string` para `createdAt`/`updatedAt` | Definido por integrante-1 en `models/product.ts` |
| Sufijo de páginas | `.component.ts` | Establecido por Sebastian en `home.component.ts` |
| Dónde crear DTOs | Archivos separados `models/<name>.dto.ts` | No modificar los archivos del equipo; mantener separación clara |
| Inyección de dependencias | `inject()` en `providedIn: 'root'` services | Angular moderno, menos boilerplate |
| Formularios | `[(ngModel)]` + `FormsModule` | Junior-friendly, evaluado por el spec |
| Control flow | `@if` / `@for` con `track` | Angular 18 nativo, evaluado por el spec |
| URL base de la API | `http://localhost:3000` por ahora | Cuando se active `proxy.conf.json` se cambiará a `/api` |

---

### Commits mergeados de la FASE 3

| Commit | PR | Issue | Archivos | Estado |
|--------|----|----|----------|--------|
| `04fc996` | #45 | #25 | `models/{product,category}.dto.ts`, `services/{product,category}.service.ts` | ✅ Mergeado (`f2aa83b`) |
| `0785996` | #51 | #30 | `models/user.dto.ts`, `services/{favorites,user}.service.ts` | ✅ Mergeado (`4e12943`) |
| `28f9ecf` | #53 | #16, #32 | `pages/products/products.component.{ts,html,css}` | ✅ Mergeado (`85cbb5f`) |
| `429457d` | #54 | #17, #33 | `pages/categories/categories.component.{ts,html,css}` | ✅ Mergeado (`318d451`) |
| `bcec36a` | #49 | — (docs) | `docs/traceability.md` | ✅ Mergeado (`b4d330a`) |

---

## FASE 4 — Reviews de @SrLampi1001 y fixes (mergeado)

El reviewer @SrLampi1001 hizo blocking comments en todos los PRs de
código. Un solo blocker compartido destrababa los 4 PRs: **faltaba
`provideHttpClient()` en `app.config.ts`**, sin lo cual `inject(HttpClient)`
fallaba con `NullInjectorError` en runtime.

### Commits de fix

| Commit | PR | Cambios |
|--------|----|---------|
| `4b28050` | #55 (nuevo mini-PR) | `app.config.ts`: agregar `provideHttpClient()` |
| `23e16d1` | #45 | `limit = 100` → `limit = 10`; `import { Product }` al top |
| `d7ee5b7` | #51 | `add()` ahora devuelve `Observable<Favorite>`; nueva `models/favorite.ts` |
| `fdf212a` | #53 | `errorMsg` a `signal('')`; `takeUntilDestroyed()`; helper `extractErrorMessage`; `loadProducts` con `limit=1000` |
| `7d44931` | #54 | `errorMsg` a signal; `takeUntilDestroyed()`; helper compartido |

### PR #55 (mini-PR)

Es un PR de una sola línea que agrega el provider de HttpClient al
`app.config.ts`. Se mergeó al final de la FASE 4 para destrabar los
otros 4 PRs.

**Estado final:** el equipo terminó mergeando `provideHttpClient()`
directamente con un commit dedicado (`ba88ab5`), cerrando el círculo
pero dejando a mi PR #55 mergeado también (con el mismo cambio duplicado
en el merge commit final).

---

## FASE 5 — Rebase + página Favorites (#18) (en curso)

### Descubrimiento clave

El equipo mergea mis 5 PRs en un orden específico:

```
ba88ab5 chore(app): add provideHttpClient() — #55
8ec1b64 chore: apply review feedback to ProductCard and Home
18458a2 fix: remove planeacion.md and trazabilidad.md from repo
f2aa83b feat(services): ProductService and CategoryService (#25) (#45)
4e12943 feat(services): FavoritesService and UserService (#30) (#51)
b4d330a docs(traceability): add complete work log for integrante-5 sprint (#49)
85cbb5f feat(pages): Products CRUD page (#16, #32) (#53)
318d451 feat(pages): Categories CRUD page (#17, #33) (#54)
4558c53 feat(auth): implement AuthService (#15)
```

Después de esos merges, mi rama base de develop (en la que se apoyaban
los 5 PRs viejos) quedaba atrasada. @SrLampi1001 me da la instrucción
explícita de rebasear.

### Rebase de los 5 PRs (commits nuevos)

Cada uno se rebasa contra `origin/develop` con `git rebase origin/develop`
+ `git push --force-with-lease`. **No hubo conflictos** porque mis PRs
tocaban archivos distintos a los del equipo:

| PR | Branch | HEAD nuevo | Fix extra |
|----|--------|------------|-----------|
| #45 | `feat/issue-25-services-product-category` | `5acfeac` | mover `import { Category }` al top de `category.dto.ts` (solo se había hecho en `product.dto.ts`) |
| #51 | `feat/issue-30-services-favorites-user` | `f942008` | — |
| #53 | `feat/issue-16-products-page` | `c0527e8` | agregar `takeUntilDestroyed()` a `loadProducts()` (faltaba esa, el resto sí lo tenía) |
| #54 | `feat/issue-17-categories-page` | `12fa782` | — |
| #49 | `docs/traceability` | `cafed02` | — |

### Commit `5303e9b` — #18 Favorites page (PR #68, aún no mergeado)

**Branch:** `feat/issue-18-favorites-page` (basada en `develop` post-merge)
**PR:** #68
**Issue:** #18

**Qué hice:** Componente standalone que lista los productos favoritos del
usuario autenticado y permite quitarlos.

**Por qué:**

- A diferencia de la FASE 1 (donde dibujaba una tarjeta inline), ahora
  **reusa el `ProductCardComponent` de Sebastian** (#10) que ya está
  mergeado en `components/ui/product-card/`. Esto cumple el spec
  ("Debe reutilizar el mismo componente de tarjeta de producto usado en Home").
- El botón "Quitar" está separado del card para no confundirlo con la
  navegación al detalle.
- Patrón consistente con Products/Categories: `signal()`, `takeUntilDestroyed()`,
  `extractErrorMessage()`, CSS Grid responsivo.

**Cómo:**

```ts
// Importa ProductCardComponent
imports: [CommonModule, ProductCardComponent]

// Carga
this.favoritesService.getAll().pipe(takeUntilDestroyed()).subscribe(...)

// Quitar
this.favoritesService.remove(p.id).pipe(takeUntilDestroyed()).subscribe(
  next: () => this.load(),
  error: (err) => this.errorMsg.set(extractErrorMessage(err, '...')),
)
```

**Archivos:**

- `frontend/src/app/pages/favorites/favorites.component.ts`
- `frontend/src/app/pages/favorites/favorites.component.html`
- `frontend/src/app/pages/favorites/favorites.component.css`

---

## FASE 6 — Pendiente

| Issue | Estado | Trabajo |
|-------|--------|---------|
| **#19** Profile page | ⏳ Pendiente | Crear `pages/profile/profile.component.{ts,html,css}` con UserService + AuthService |

---

## Hallazgo: "Cierra" vs "Closes" en GitHub

**Bug que descubrimos y NO afecta al código, pero sí al tracking de issues:**

En los PRs originales usé "Cierra #XX" (español) en los bodies esperando
que GitHub auto-cerrara las issues al mergear. **No funciona** — GitHub
solo reconoce keywords en inglés: `Closes`, `Fixes`, `Resolves`.

**Consecuencia:** aunque los 5 PRs viejos están mergeados, las issues
#25, #30, #16, #17, #32, #33 siguen **OPEN** en GitHub porque la
keyword no fue reconocida.

**Solución adoptada:** las cerré manualmente con `gh issue close` y un
comentario referenciando el commit de merge. (Detalle de los cierres
más abajo en la línea de tiempo.)

**Lección:** usar siempre `Closes #XX` en inglés en PR titles/bodies.

---

## Estado final de las issues de integrante-5

| Issue | Título | Estado | Cerrada por |
|-------|--------|--------|-------------|
| #16 | Crear página Products (CRUD) | ✅ CLOSED | merge de PR #53 |
| #17 | Crear página Categories (CRUD) | ✅ CLOSED | merge de PR #54 |
| #18 | Crear página Favorites | 🟡 OPEN (PR #68 pendiente) | |
| #19 | Crear página Profile | ⏳ OPEN (sin PR) | |
| #25 | Crear servicios ProductService y CategoryService | ✅ CLOSED | merge de PR #45 |
| #30 | Crear servicios FavoritesService y UserService | ✅ CLOSED | merge de PR #51 |
| #32 | Implementar CRUD de Products | ✅ CLOSED | merge de PR #53 |
| #33 | Implementar CRUD de Categories | ✅ CLOSED | merge de PR #54 |

---

## Apéndice — endpoints consumidos (referencia rápida)

Para que cualquiera que extienda estos services sepa qué hay detrás:

| Service | Base | Método | Path | Auth | Notas |
|---|---|---|---|---|---|
| ProductService | `/products` | GET | `/` | público | Soporta `?search=&categoryId=&page=&limit=` |
| ProductService | `/products` | GET | `/:id` | público | UUID válido |
| ProductService | `/products` | POST | `/` | JWT | CreateProductDto |
| ProductService | `/products` | PATCH | `/:id` | JWT | UpdateProductDto (todos opcionales) |
| ProductService | `/products` | DELETE | `/:id` | JWT | Responde 204 |
| CategoryService | `/categories` | GET | `/` | público | Lista ordenada alfabéticamente |
| CategoryService | `/categories` | GET | `/:id` | público | UUID válido |
| CategoryService | `/categories` | POST | `/` | JWT | CreateCategoryDto |
| CategoryService | `/categories` | PATCH | `/:id` | JWT | UpdateCategoryDto |
| CategoryService | `/categories` | DELETE | `/:id` | JWT | Responde 409 si hay productos asociados |
| FavoritesService | `/favorites` | GET | `/` | JWT | Devuelve `Product[]` directamente |
| FavoritesService | `/favorites` | POST | `/:productId` | JWT | Body `{}`; 409 si ya está |
| FavoritesService | `/favorites` | DELETE | `/:productId` | JWT | Responde 204; 404 si no estaba |
| UserService | `/users/me` | GET | `/` | JWT | Devuelve `User` sin password |
| UserService | `/users/me/password` | PATCH | `/` | JWT | `ChangePasswordDto`; 401 si current mal |
| AuthService | `/auth` | POST | `/login` | público | Devuelve `AuthResponse { accessToken, user }` |
| AuthService | `/auth` | POST | `/register` | público | Devuelve `AuthResponse` |
| AuthService | `/auth` | POST | `/logout` | JWT | `LogoutResponse { message }` |

Códigos de error que NestJS puede devolver y que estos services deben
manejar en la UI:

| Código | Significado | Acción recomendada |
|--------|-------------|--------------------|
| 400 | Validación fallida | Mostrar `err.error.message` (puede ser array) |
| 401 | JWT inválido/expirado | El interceptor (#29) limpia sesión y redirige |
| 404 | Recurso no existe | Informar al usuario |
| 409 | Conflicto (duplicado, FK) | Mostrar `err.error.message` |
