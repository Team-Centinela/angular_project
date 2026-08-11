import { Product } from './product';

/**
 * DTOs para el endpoint /products.
 * Coinciden con los `class-validator` del backend en
 * `backend/src/modules/products/dto/`.
 *
 * Issue relacionado: #25
 */

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  images?: string[];
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
