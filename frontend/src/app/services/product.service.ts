/**
 * Servicio: ProductService
 * --------------------------------------------------------------
 * Encapsula todas las llamadas HTTP al endpoint /products
 * de la API NestJS.
 *
 * Issue relacionado: #25
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateProductDto,
  ProductListResponse,
  UpdateProductDto,
} from '../models/product.dto';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/products';

  getAll(
    search?: string,
    categoryId?: string,
    page = 1,
    limit = 100,
  ): Observable<ProductListResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) params = params.set('search', search);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<ProductListResponse>(this.base, { params });
  }

  getOne(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.base, dto);
  }

  update(id: string, dto: UpdateProductDto): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
