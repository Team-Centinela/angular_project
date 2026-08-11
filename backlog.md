# Backlog - Sistema de Gestión de Productos

## Equipo: 5 integrantes
## Cronograma: 1 semana (Lunes a Viernes)

---

## Distribución de roles

| Rol | Responsable | Enfoque principal |
|-----|-------------|-------------------|
| **Integrante 1** | Configuración | Proyecto, Docker, Supabase, Models, README |
| **Integrante 2** | Layout | Navbar, Sidebar, Footer, Routing |
| **Integrante 3** | Públicas | Home, Detalle, ProductCard, SearchBar |
| **Integrante 4** | Autenticación | Login, Register, Auth Service, Guard, Interceptor |
| **Integrante 5** | CRUD Protegido | Products, Categories, Favorites, Profile |

---

## LUNES - Planeación y Estructura

### Integrante 1 - Configuración
- [ ] Crear proyecto Angular con `ng new`
- [ ] Configurar Docker (Dockerfile + docker-compose.yml)
- [ ] Crear cuenta en Supabase y configurar proyecto
- [ ] Crear tablas en Supabase (products, categories, users, favorites)
- [ ] Crear models/interfaces (Product, Category, User)
- [ ] Configurar README inicial

### Integrante 2 - Layout
- [ ] Crear estructura de carpetas (pages/, components/, services/, guards/)
- [ ] Crear componente Navbar
- [ ] Crear componente Sidebar
- [ ] Crear componente Footer
- [ ] Configurar rutas en app.routes.ts

### Integrante 3 - Públicas
- [ ] Crear página Home
- [ ] Crear componente ProductCard
- [ ] Crear componente SearchBar
- [ ] Crear componente Loading

### Integrante 4 - Autenticación
- [ ] Crear página Login
- [ ] Crear página Register
- [ ] Crear servicio AuthService
- [ ] Crear interfaz de Login/Register

### Integrante 5 - CRUD Protegido
- [ ] Crear página Products (CRUD)
- [ ] Crear página Categories (CRUD)
- [ ] Crear página Favorites
- [ ] Crear página Profile

---

## MARTES - Pantallas Públicas y Consumo Inicial

### Integrante 1 - Configuración
- [ ] Verificar que Docker funciona correctamente
- [ ] Configurar variables de entorno para Supabase
- [ ] Crear servicio de conexión a Supabase
- [ ] Ayudar a configurar HTTPClientModule

### Integrante 2 - Layout
- [ ] Implementar navegación entre páginas con Router
- [ ] Conectar Navbar con rutas
- [ ] Agregar botón de Login/Logout en Navbar
- [ ] Estilos básicos con Bootstrap

### Integrante 3 - Públicas
- [ ] Consumir endpoint GET /products en Home
- [ ] Implementar barra de búsqueda funcional
- [ ] Implementar filtro por categorías
- [ ] Mostrar indicador de carga
- [ ] Navegar a detalle al hacer click en producto

### Integrante 4 - Autenticación
- [ ] Crear servicio HTTP para Login (POST /auth/login)
- [ ] Crear servicio HTTP para Register (POST /auth/register)
- [ ] Implementar formularios con ngModel
- [ ] Validación básica de formularios

### Integrante 5 - CRUD Protegido
- [ ] Consumir endpoint GET /products para listar
- [ ] Consumir endpoint GET /categories para listar
- [ ] Crear servicio ProductService
- [ ] Crear servicio CategoryService

---

## MIÉRCOLES - Autenticación, Servicios y Guards

### Integrante 1 - Configuración
- [ ] Configurar proxy para evitar problemas de CORS
- [ ] Documentar endpoints de la API
- [ ] Ayudar con configuración de entorno

### Integrante 2 - Layout
- [ ] Mostrar/ocultar elementos según estado de autenticación
- [ ] Agregar nombre de usuario en Navbar
- [ ] Estilos responsive

### Integrante 3 - Públicas
- [ ] Implementar página de Detalle de Producto
- [ ] Consumir GET /products/:id
- [ ] Mostrar información completa del producto
- [ ] Botón de favorito (visible solo si está logueado)

### Integrante 4 - Autenticación
- [ ] Implementar Auth Guard para rutas protegidas
- [ ] Implementar HTTP Interceptor para JWT
- [ ] Manejar respuesta 401 (redirigir a Login)
- [ ] Guardar JWT en localStorage
- [ ] Implementar Logout

### Integrante 5 - CRUD Protegido
- [ ] Crear servicio FavoritesService
- [ ] Crear servicio UserService
- [ ] Implementar POST /favorites/:productId
- [ ] Implementar DELETE /favorites/:productId

---

## JUEVES - CRUD y Funcionalidades Protegidas

### Integrante 1 - Configuración
- [ ] Verificar que todo funciona con Docker
- [ ] Probar que Supabase responde correctamente
- [ ] Ayudar a resolver errores comunes

### Integrante 2 - Layout
- [ ] Ajustes finales de navegación
- [ ] Agregar loading global si es necesario
- [ ] Revisar estilos generales

### Integrante 3 - Públicas
- [ ] Pulir estilos de Home y Detalle
- [ ] Manejo de errores (producto no encontrado)
- [ ] Estados de carga en Home

### Integrante 4 - Autenticación
- [ ] Implementar Logout completo (POST /auth/logout + limpiar JWT)
- [ ] Redirigir al Home después de Logout
- [ ] Manejo de errores de autenticación

### Integrante 5 - CRUD Protegido
- [ ] Implementar CREATE de Products
- [ ] Implementar EDIT de Products
- [ ] Implementar DELETE de Products
- [ ] Implementar CREATE de Categories
- [ ] Implementar EDIT de Categories
- [ ] Implementar DELETE de Categories
- [ ] Implementar página Favorites con productos del usuario
- [ ] Implementar página Profile con info del usuario
- [ ] Implementar cambio de contraseña (PATCH /users/me/password)

---

## VIERNES - Pulido y Presentación

### Todos - Trabajo en equipo
- [ ] Revisar flujo completo: Login → Navegar → Buscar → CRUD → Favoritos → Perfil → Logout
- [ ] Verificar que el Guard funciona (intentar acceder sin login)
- [ ] Pulir estilos generales
- [ ] Completar README con:
  - Nombre del proyecto
  - Integrantes
  - Tecnologías
  - Cómo instalar
  - Cómo ejecutar
  - URL de la API
- [ ] Preparar presentación (10-12 minutos)
- [ ] Cada integrante prepara qué parte va a explicar

### Integrante 1
- [ ] Verificar Docker
- [ ] Verificar README

### Integrante 2
- [ ] Revisar navegación completa

### Integrante 3
- [ ] Demostrar Home y Detalle

### Integrante 4
- [ ] Demostrar Login, Register, Logout, Guard

### Integrante 5
- [ ] Demostrar CRUD de Products y Categories

---

## Notas importantes

1. **Cada integrante debe hacer commits propios** - El historial de Git debe evidenciar trabajo distribuido
2. **Usar ngModel** para formularios (no formularios reactivos)
3. **Usar @if y @for** (nuevas directivas de Angular)
4. **Usar inject()** para inyección de dependencias
5. **Todos los HTTP van en Services** - No llamar API directamente desde componentes
6. **Manejar errores** - Mostrar mensajes al usuario, no solo console.log
7. **Usar pipes** - currency, date, etc.

---

## Tecnologías

- Angular 22
- Bootstrap
- Supabase (Base de datos)
- Docker
- TypeScript

---

## Endpoints disponibles

```
POST   /auth/login
POST   /auth/register
POST   /auth/logout
GET    /products
GET    /products?search=
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
POST   /favorites/:productId
DELETE /favorites/:productId
GET    /favorites
GET    /users/me
PATCH  /users/me/password
```
