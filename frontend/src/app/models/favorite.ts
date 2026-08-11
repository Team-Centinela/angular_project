/**
 * Modelo: Favorite
 * --------------------------------------------------------------
 * Define la forma (interfaz TypeScript) que tiene un favorito
 * devuelto por el backend.
 *
 * Coincide con la entidad del backend en
 * `backend/src/modules/favorites/entities/favorite.entity.ts`.
 *
 * Issue relacionado: #30
 */
export interface Favorite {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
}
