import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/favorites';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  add(productId: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${productId}`, {});
  }

  remove(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${productId}`);
  }
}
