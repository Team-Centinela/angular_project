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
| 3 | Reintento adaptado | Pull de `develop`, identificación de convenciones del equipo (DTOs en `*.dto.ts`, sufijo `.component.ts`, `string` para fechas), nueva implementación de #25 | **En curso** |
| 4 | Pendiente | #30, #16, #17, #18, #19 — uno por uno según las indicaciones del equipo | **Pendiente** |

Diagrama simplificado del flujo:

```
main ─┬─► feat/issue-25 ─┐
      ├─► feat/issue-30 ─┤   (FASE 1: descartado)
      ├─► feat/issue-16 ─┤
      ├─► feat/issue-17 ─┤
      ├─► feat/issue-18 ─┤
      └─► feat/issue-19 ─┘
                       │
                       └───► git reset --hard origin/main  (FASE 2)

develop ─► feat/issue-25 ──► PR #45  (FASE 3, en curso)
       └─► docs/traceability ──► PR (FASE 3, este archivo)
```

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
     `models/product.ts`.
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

## FASE 3 — Reintento adaptado

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

| Decisión | Conven Adoptada | Razón |
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

### Commit `04fc996` — PR #45 — Issue #25

**Branch:** `feat/issue-25-services-product-category` (basada en `develop`)
**Aplicable a:** #25

**Qué hice:** Creé los dos servicios HTTP que encapsulan el consumo de
`/products` y `/categories` desde la API NestJS, junto con los DTOs que
necesitan en archivos separados.

**Por qué:** Es el primer eslabón de la cadena. Las páginas #16, #17, #18,
#19 necesitan estos servicios para hablar con el backend. Mantener DTOs en
archivos `*.dto.ts` evita modificar los modelos del equipo (regla de oro:
no toco código ajeno si no es estrictamente necesario).

**Cómo:**

1. **DTOs primero** — Defino las interfaces en `models/product.dto.ts` y
   `models/category.dto.ts`. Cada DTO coincide 1-a-1 con el `class-validator`
   del backend:
   - `CreateProductDto`: campos obligatorios según
     `backend/src/modules/products/dto/create-product.dto.ts`.
   - `UpdateProductDto`: todos los campos opcionales (PartialType).
   - `ProductListResponse`: respuesta paginada `{ data, total, page, limit, totalPages }`
     que devuelve `ProductsService.findAll()`.
   - `CreateCategoryDto` / `UpdateCategoryDto`: análogo para categorías.

   Los DTOs están **separados** de los modelos del equipo
   (`models/product.ts`) precisamente porque estos últimos ya existen y no
   queremos modificarlos sin coordinación.

2. **`ProductService`** con cinco métodos:
   - `getAll(search?, categoryId?, page, limit)` → arma `HttpParams`
     solo si los filtros tienen valor (evita `?search=` vacío).
   - `getOne(id)` → `GET /products/:id`.
   - `create(dto)` → `POST /products` (requiere JWT, lo añade el
     interceptor #29 automáticamente).
   - `update(id, dto)` → `PATCH /products/:id`.
   - `delete(id)` → `DELETE /products/:id` (responde 204).

   Decisiones técnicas:
   - `inject(HttpClient)` en vez de constructor injection (Angular moderno).
   - `providedIn: 'root'` para que sea singleton sin declararlo en
     `app.config.ts`.
   - Devuelve `Observable<T>` (encaja con interceptors futuros).
   - URL base literal: si el proxy (`proxy.conf.json`, ya en develop) se
     activa, se cambia `base` a `/api/products` y nada más.

3. **`CategoryService`** con la misma forma, sin paginación (categorías son
   pocas y el backend devuelve la lista completa ordenada alfabéticamente).

4. **Commit** con Conventional Commits + `Closes #25` para que GitHub
   cierre la issue automáticamente al mergear el PR.

**Archivos tocados:**

```
A  frontend/src/app/models/product.dto.ts
A  frontend/src/app/models/category.dto.ts
A  frontend/src/app/services/product.service.ts
A  frontend/src/app/services/category.service.ts
```

---

## FASE 4 — Pendiente

| Orden | Issue | Trabajo | Estado |
|------|-------|---------|--------|
| 1 | #25 | services product/category | ✅ Commit `04fc996`, PR #45 abierto |
| 2 | #30 | services favorites/user | ⏳ Pendiente |
| 3 | #16, #32 | Products CRUD page | ⏳ Pendiente |
| 4 | #17, #33 | Categories CRUD page | ⏳ Pendiente |
| 5 | #18 | Favorites page | ⏳ Pendiente |
| 6 | #19 | Profile page | ⏳ Pendiente |

Cada paso generará un commit + PR nuevo contra `develop`. El usuario
indicará cuándo continuar con el siguiente.

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

Códigos de error que NestJS puede devolver y que estos services deben
manejar en la UI:

| Código | Significado | Acción recomendada |
|--------|-------------|--------------------|
| 400 | Validación fallida | Mostrar `err.error.message` (puede ser array) |
| 401 | JWT inválido/expirado | El interceptor (#29) limpia sesión y redirige |
| 404 | Recurso no existe | Informar al usuario |
| 409 | Conflicto (duplicado, FK) | Mostrar `err.error.message` |
