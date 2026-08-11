# Sistema de Gestión de Productos

## Integrantes

- Integrante 1 - Configuración
- Integrante 2 - Layout
- Integrante 3 - Públicas
- Integrante 4 - Autenticación
- Integrante 5 - CRUD Protegido

## Tecnologías

- Angular 18
- Bootstrap
- NestJS (Backend)
- Supabase (PostgreSQL)
- Docker
- TypeScript

## Cómo instalar

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Cómo ejecutar

### Sin Docker

**Backend:**
```bash
cd backend
npm run start:dev
```

**Frontend:**
```bash
cd frontend
ng serve
```

### Con Docker

```bash
docker-compose up --build
```

## URLs

- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- Swagger (documentación API): http://localhost:3000/api/docs

## Base de datos

Usamos Supabase (PostgreSQL). La configuración está en el archivo `backend/.env`.

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
