# Trazabilidad del Proyecto

## Sistema de Gestión de Productos

---

## Resumen del proyecto

| Aspecto | Detalle |
|---------|---------|
| **Nombre** | Sistema de Gestión de Productos |
| **Equipo** | Team Centinela (5 integrantes) |
| **Repositorio** | https://github.com/Team-Centinela/angular_project |
| **Backend** | NestJS con Supabase (PostgreSQL) |
| **Frontend** | Angular 18 |
| **Base de datos** | Supabase (PostgreSQL) |
| **Containerización** | Docker |

---

## Cronograma de trabajo

### Día 1 - Lunes (Planeación y Estructura)

#### Integrante 1 (Configuración)

| Hora | Actividad | Estado |
|------|-----------|--------|
| 06:30 | Revisión del repositorio del profesor | ✅ |
| 06:40 | Fork del backend a carpeta `backend/` | ✅ |
| 06:50 | Creación de cuenta en Supabase | ✅ |
| 07:00 | Configuración de archivo `.env` | ✅ |
| 07:10 | Prueba de conexión a Supabase | ✅ |
| 07:25 | Ejecución de migración de tablas | ✅ |
| 07:38 | Creación de proyecto Angular 18 | ✅ |
| 07:45 | Creación de Dockerfiles | ✅ |
| 07:50 | Creación de docker-compose.yml | ✅ |
| 07:55 | Creación de models/interfaces | ✅ |
| 08:00 | Configuración de proxy CORS | ✅ |
| 08:05 | Creación de README.md | ✅ |
| 08:10 | Subida a rama develop | ✅ |

---

## Decisiones técnicas

### 1. Backend - NestJS

**¿Por qué NestJS?**
- El profesor proporcionó el backend listo para usar
- Incluye autenticación JWT completa
- Tiene documentación Swagger integrada
- Usa TypeORM para manejo de base de datos

**Archivos importantes del backend:**
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticación (login, register, logout)
│   │   ├── products/      # CRUD de productos
│   │   ├── categories/    # CRUD de categorías
│   │   ├── favorites/     # Sistema de favoritos
│   │   └── users/         # Gestión de usuarios
│   ├── migrations/        # Migraciones de base de datos
│   └── main.ts           # Punto de entrada
├── .env                   # Variables de entorno (NO se sube al repositorio)
└── package.json
```

### 2. Base de datos - Supabase

**¿Por qué Supabase?**
- Es gratis para proyectos pequeños
- Incluye base de datos PostgreSQL
- Fácil de configurar
- Tiene panel de administración web

**Tablas creadas:**

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios registrados |
| `categories` | Categorías de productos |
| `products` | Productos del catálogo |
| `product_images` | Imágenes de productos |
| `favorites` | Favoritos de usuarios |
| `migrations` | Control de migraciones |

**Conexión:**
- Usamos **Session Pooler** (no conexión directa) porque nuestra red no soporta IPv6
- Cadena de conexión: `postgresql://postgres.mfxrypwaufiqizntskmv:***@aws-0-us-east-2.pooler.supabase.com:5432/postgres`

### 3. Frontend - Angular 18

**¿Por qué Angular 18?**
- Es la versión estable más reciente que funciona correctamente
- Angular 22 no existe todavía
- Las directivas `@if` y `@for` están disponibles

**Estructura del frontend:**
```
frontend/
├── src/app/
│   ├── models/            # Interfaces (Product, Category, User)
│   ├── pages/             # Páginas (Home, Login, Register, etc.)
│   ├── components/        # Componentes reutilizables
│   ├── services/          # Servicios HTTP
│   ├── guards/            # Protección de rutas
│   └── interceptors/      # Manejo automático de JWT
├── proxy.conf.json        # Configuración de proxy para CORS
└── angular.json           # Configuración de Angular
```

### 4. Docker

**¿Por qué Docker?**
- Facilita la ejecución del proyecto en cualquier computadora
- No necesita instalar Node.js o dependencias manualmente
- El profesor pidió que fuera dockerizado

**Archivos Docker:**
- `backend/Dockerfile` - Para el backend
- `frontend/Dockerfile` - Para el frontend
- `docker-compose.yml` - Para correr ambos servicios juntos

**Cómo correr con Docker:**
```bash
docker-compose up --build
```

---

## Gestión del proyecto en GitHub

### Issues creadas

Se crearon **36 issues** en GitHub Projects para trackear el trabajo:

| Día | Integrante 1 | Integrante 2 | Integrante 3 | Integrante 4 | Integrante 5 |
|-----|--------------|--------------|--------------|--------------|--------------|
| Lunes | 4 | 4 | 4 | 3 | 4 |
| Martes | 2 | 1 | 1 | 1 | 1 |
| Miércoles | 1 | 0 | 1 | 2 | 1 |
| Jueves | 1 | 0 | 0 | 1 | 2 |
| Viernes | 0 | 0 | 0 | 0 | 0 |

### Issues cerradas (Integrante 1)

| Issue | Tarea | Estado |
|-------|-------|--------|
| #1 | Crear proyecto Angular 18 | ✅ Cerrada |
| #2 | Configurar Docker | ✅ Cerrada |
| #3 | Crear cuenta Supabase | ✅ Cerrada |
| #4 | Crear models/interfaces | ✅ Cerrada |
| #21 | Configurar variables de entorno | ✅ Cerrada |

### Ramas del repositorio

| Rama | Uso |
|------|-----|
| `main` | Código estable y listo para producción |
| `develop` | Desarrollo e integración de funcionalidades |

---

## Archivos del proyecto

### Archivos principales

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Documentación principal del proyecto |
| `backlog.md` | Distribución de tareas por integrante y día |
| `gistfile1.md` | Enunciado del proyecto (lo dio el profesor) |
| `planeacion.md` | Plan de trabajo del Integrante 1 |
| `trazabilidad.md` | Este archivo (documentación del proceso) |
| `docker-compose.yml` | Configuración de Docker |

### Backend

| Archivo | Descripción |
|---------|-------------|
| `backend/.env` | Variables de entorno (NO se sube al repositorio) |
| `backend/.env.example` | Ejemplo de variables de entorno |
| `backend/Dockerfile` | Archivo de configuración de Docker |
| `backend/FRONTEND_GUIDE.md` | Guía para el equipo de frontend |

### Frontend

| Archivo | Descripción |
|---------|-------------|
| `frontend/proxy.conf.json` | Configuración de proxy para CORS |
| `frontend/Dockerfile` | Archivo de configuración de Docker |
| `frontend/src/app/models/` | Interfaces de TypeScript |

---

## Endpoints de la API

### Autenticación (no requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |

### Autenticación (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/users/me` | Obtener perfil |
| PATCH | `/users/me/password` | Cambiar contraseña |

### Productos (público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Listar productos |
| GET | `/products/:id` | Ver detalle de producto |

### Productos (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/products` | Crear producto |
| PATCH | `/products/:id` | Editar producto |
| DELETE | `/products/:id` | Eliminar producto |

### Categorías (público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categories` | Listar categorías |

### Categorías (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/categories` | Crear categoría |
| PATCH | `/categories/:id` | Editar categoría |
| DELETE | `/categories/:id` | Eliminar categoría |

### Favoritos (requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/favorites` | Listar favoritos |
| POST | `/favorites/:productId` | Agregar a favoritos |
| DELETE | `/favorites/:productId` | Eliminar de favoritos |

---

## Cómo ejecutar el proyecto

### Opción 1: Sin Docker

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
ng serve
```

### Opción 2: Con Docker

```bash
docker-compose up --build
```

### URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |

---

## Próximos pasos

### Martes - Pantallas Públicas y Consumo Inicial

**Integrante 1:**
- [ ] Verificar que Docker funciona correctamente
- [ ] Verificar que el backend levanta en puerto 3000
- [ ] Verificar que el frontend levanta en puerto 4200
- [ ] Ayudar a configurar HttpClientModule

**Integrante 2:**
- [ ] Implementar navegación entre páginas con Router
- [ ] Conectar Navbar con rutas
- [ ] Agregar botón de Login/Logout en Navbar
- [ ] Estilos básicos con Bootstrap

**Integrante 3:**
- [ ] Consumir endpoint GET /products en Home
- [ ] Implementar barra de búsqueda funcional
- [ ] Implementar filtro por categorías
- [ ] Mostrar indicador de carga

**Integrante 4:**
- [ ] Crear servicio HTTP para Login
- [ ] Crear servicio HTTP para Register
- [ ] Implementar formularios con ngModel
- [ ] Validación básica de formularios

**Integrante 5:**
- [ ] Consumir endpoint GET /products para listar
- [ ] Consumir endpoint GET /categories para listar
- [ ] Crear servicio ProductService
- [ ] Crear servicio CategoryService

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

## Contacto

- **Repositorio:** https://github.com/Team-Centinela/angular_project
- **Proyecto GitHub:** https://github.com/Team-Centinela/angular_project/projects/1
- **Documentación API:** http://localhost:3000/api/docs (cuando el backend esté corriendo)

---

*Última actualización: Lunes 11 de Agosto 2026*
