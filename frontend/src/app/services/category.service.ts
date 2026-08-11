/**
 * Servicio: CategoryService
 * --------------------------------------------------------------
 * Encapsula las llamadas HTTP al endpoint /categories.
 *
 * Issue relacionado: #25
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../models/category.dto';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/categories';

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  getOne(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  create(dto: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.base, dto);
  }

  update(id: string, dto: UpdateCategoryDto): Observable<Category> {
    return this.http.patch<Category>(`${this.base}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
