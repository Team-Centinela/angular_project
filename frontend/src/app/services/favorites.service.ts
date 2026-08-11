/**
 * Servicio: FavoritesService
 * --------------------------------------------------------------
 * Maneja los productos favoritos del usuario autenticado.
 * Consume /favorites del backend (todos los endpoints requieren JWT).
 *
 * Decisiones:
 *  - El backend ya devuelve `Product[]` (no `Favorite[]`) en
 *    GET /favorites, así que la interfaz es directa y se evita
 *    doble fetch.
 *  - add(productId) envía body `{}` porque `httpClient.post()` con
 *    `null` puede warn-ear.
 *
 * Issue relacionado: #30
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/favorites';

  /** Devuelve los productos favoritos del usuario (autenticado). */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  /**
   * Marca un producto como favorito. Devuelve el Favorite creado.
   * 409 si ya estaba en favoritos.
   */
  add(productId: string): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.base}/${productId}`, {});
  }

  /** Quita un producto de favoritos. 204 si OK, 404 si no estaba. */
  remove(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${productId}`);
  }
}
