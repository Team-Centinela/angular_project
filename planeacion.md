# Planeación - Integrante 1 (Configuración)

## Equipo: Team Centinela
## Integrante: Configuración (Tú)

---

## Estado actual

| Tarea | Estado |
|-------|--------|
| Fork del backend | ✅ Completado |
| Configurar .env con Supabase | ✅ Completado |
| Probar conexión a Supabase | ✅ Completado |
| Subir gistfile1.md a main | ✅ Completado |
| Migración de tablas en Supabase | ✅ Completado |
| Crear proyecto Angular 18 | ✅ Completado |
| Docker (Dockerfiles + docker-compose) | ✅ Completado |
| Models/Interfaces | ✅ Completado |
| Proxy CORS | ✅ Completado |
| README | ✅ Completado |
| Configurar .gitignore | ✅ Completado |

---

## Estructura del proyecto

```
angular_project/
├── backend/                    # Fork del repo del profesor ✅
│   ├── src/
│   ├── .env                    # Variables de entorno (Supabase + JWT) ✅
│   └── package.json
├── frontend/                   # App Angular 18 (se crea hoy)
│   └── src/app/
│       ├── pages/
│       ├── components/
│       ├── services/
│       ├── guards/
│       ├── interceptors/
│       └── models/
├── docker-compose.yml
├── .gitignore
├── README.md
├── backlog.md
├── gistfile1.md
└── planeacion.md
```

---

## Tareas por día

### LUNES - Planeación y Estructura ✅ COMPLETADO

#### Completado ✅
- [x] Fork del backend del profesor a carpeta `backend/`
- [x] Configurar archivo `.env` con Supabase
- [x] Probar conexión a Supabase (backend conecta correctamente)
- [x] Subir gistfile1.md a rama main
- [x] Ejecutar migración de tablas en Supabase (`npm run migration:run`)

#### Pendiente ⏳
- [x] Crear proyecto Angular 18 en `frontend/`
  ```bash
  npm install -g @angular/cli@18
  ng new frontend --style=scss --routing --skip-git --skip-tests --ssr=false
  ```
- [x] Crear Dockerfile del backend
- [x] Crear Dockerfile del frontend
- [x] Crear `docker-compose.yml`
- [x] Crear `proxy.conf.json` para CORS
- [x] Crear `models/interfaces` (Product, Category, User)
- [x] Configurar `.gitignore` completo
- [x] Crear `README.md` del proyecto

---

### MARTES - Pantallas Públicas y Consumo Inicial

- [ ] Verificar que Docker funciona correctamente
  ```bash
  docker-compose up --build
  ```
- [ ] Verificar que el backend levanta en puerto 3000
- [ ] Verificar que el frontend levanta en puerto 4200
- [ ] Configurar variables de entorno para Supabase
- [ ] Crear servicio de conexión a Supabase
- [ ] Ayudar a configurar HttpClientModule
- [ ] Verificar Swagger funciona en `http://localhost:3000/api/docs`

---

### MIÉRCOLES - Autenticación, Servicios y Guards

- [ ] Configurar proxy para evitar problemas de CORS
  ```json
  {
    "/api": {
      "target": "http://backend:3000",
      "secure": false,
      "changeOrigin": true
    }
  }
  ```
- [ ] Documentar endpoints de la API
- [ ] Ayudar con configuración de entorno
- [ ] Verificar que el proxy funciona correctamente

---

### JUEVES - CRUD y Funcionalidades Protegidas

- [ ] Verificar que todo funciona con Docker
- [ ] Probar que Supabase responde correctamente
- [ ] Ayudar a resolver errores comunes
- [ ] Verificar que todas las rutas funcionan
- [ ] Probar flujo completo: Login → Navegar → CRUD

---

### VIERNES - Pulido y Presentación

- [ ] Verificar Docker
- [ ] Verificar README
- [ ] Revisar flujo completo con el equipo
- [ ] Verificar que el Guard funciona
- [ ] Preparar qué parte voy a explicar en la presentación

---

## Archivos que debo crear

### 1. frontend/ (proyecto Angular 18)
```bash
ng new frontend --style=scss --routing --skip-git --skip-tests --ssr=false
```

### 2. backend/Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

### 3. frontend/Dockerfile (multi-stage build)
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4. docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DATABASE_URL=postgresql://postgres.mfxrypwaufiqizntskmv:Angular.123**@aws-0-us-east-2.pooler.supabase.com:5432/postgres
      - JWT_SECRET=equipo-centinela-angular-2024-secreto
      - JWT_EXPIRES_IN=1d
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 5. frontend/proxy.conf.json
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

### 6. frontend/src/app/models/product.ts
```typescript
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  order: number;
}

import { Category } from './category';
```

### 7. frontend/src/app/models/category.ts
```typescript
export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### 8. frontend/src/app/models/user.ts
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
```

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

- Angular 18
- Bootstrap
- NestJS (Backend)
- Supabase (PostgreSQL)
- Docker
- TypeScript

---

## Comandos útiles

```bash
# Instalar Angular CLI
npm install -g @angular/cli@18

# Crear proyecto Angular
ng new frontend --style=scss --routing --skip-git --skip-tests --ssr=false

# Generar componentes
ng generate component components/layout/navbar
ng generate component pages/home
ng generate service services/auth

# Correr en desarrollo
cd frontend && ng serve

# Docker
docker-compose up --build
docker-compose down
```
