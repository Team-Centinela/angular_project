# Bitácora de Sebastian (integrante-3)

Registro personal del trabajo realizado en cada issue asignada, con el qué, dónde y por qué de cada cambio. Se actualiza a medida que avanzo en las tareas. Cualquier compañero puede editar y agregar entradas (mientras mantenga el formato).

---

## Issue #9 — Crear página Home

**Día:** Lunes
**Rama:** `feat/issue-9-home-page`
**PR:** [#37](https://github.com/Team-Centinela/angular_project/pull/37)
**Estado:** Abierta (mergeable, esperando aprobación)

### Qué hice
Creé la página principal (`HomeComponent`) con todo lo que pide la issue:

- Listado de productos en un grid
- Barra de búsqueda (filtra por nombre y descripción)
- Filtro por categorías (desplegable `<select>`)
- Indicador de carga (`@if` sobre `loading`)
- Mensaje de estado vacío cuando no hay resultados
- Ruta `''` registrada en `app.routes.ts` apuntando al componente

### Dónde
Archivos dentro del proyecto **Angular 18** (`frontend/`), que es el que el equipo consensuó usar (en `develop` se había quedado también un proyecto Angular 21 adicional en la raíz, pero se descartó):

| Archivo | Tipo |
|---|---|
| `frontend/src/app/pages/home/home.component.ts` | Componente standalone (lógica + datos mock) |
| `frontend/src/app/pages/home/home.component.html` | Template con `@for`, `@if`, `[(ngModel)]` |
| `frontend/src/app/pages/home/home.component.scss` | Estilos mínimos del grid y filtros |
| `frontend/src/app/app.routes.ts` | Ruta `''` → `HomeComponent` |

### Por qué
- **Datos hardcodeados** en vez de llamar a la API: la issue #23 ("Consumir `GET /products` en Home") es del martes y depende del service (#25) que aún no existe. Poner la llamada ahora habría obligado a crear también #25 fuera de turno y ensuciar el reparto de tareas del equipo.
- **Filtrado con un `get` simple** en el `.ts`, sin `debounceTime`/`switchMap`/RxJS: el principio es mostrar el patrón más legible para principiantes. Cuando se conecte a la API, ese `get` se reemplaza por la respuesta del service.
- **`loading` queda en `false`**: mantiene el patrón listo para que en #23 se le seteé `true` antes del request y `false` después.
- **No tocamos `app.config.ts`**: todavía no hay `provideHttpClient()` porque el componente no hace llamadas HTTP todavía.
- **Componente standalone** con `FormsModule` en `imports`: es lo que usa Angular 18 por defecto y mantiene el archivo independiente del resto.
- **Conventional Commits** (`feat: ...`) en los mensajes para cumplir con `CONTRIBUTING.md`.

### Pendiente relacionado
- **Issue #10** (lunes): `Crear componente ProductCard` — el bloque `<article class="card">…</article>` del HTML actual se va a mover a ese componente y Home va a usarlo con un `<app-product-card>`.
- **Issue #11** (lunes): `Crear componente SearchBar` — el `<input>` se va a mover a ese componente.
- **Issue #12** (lunes): `Crear componente Loading` — el `@if (loading)` va a usar ese componente.
- **Issue #23** (martes): reemplazar los mocks por `HttpClient.get<Product[]>` + usar el service (#25).
- **Issue #27** (miércoles): cuando se cree el detalle de producto, agregar `routerLink` en la card para navegar a `/products/:id`.

### Cómo probar
```bash
cd frontend
npm install
npm start
# Abrir http://localhost:4200
```
Tipear en el buscador y elegir una categoría para ver el filtrado en vivo.
