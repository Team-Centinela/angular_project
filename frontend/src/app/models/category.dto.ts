/**
 * DTOs para el endpoint /categories.
 * Coinciden con los `class-validator` del backend en
 * `backend/src/modules/categories/dto/`.
 *
 * Issue relacionado: #25
 */

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

import { Category } from './category';
