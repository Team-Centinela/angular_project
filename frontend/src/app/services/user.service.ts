/**
 * Servicio: UserService
 * --------------------------------------------------------------
 * Maneja la información del perfil del usuario autenticado.
 * Consume /users/me del backend (todos los endpoints requieren JWT,
 * que el interceptor #29 añadirá automáticamente al header).
 *
 * Issue relacionado: #30 (servicio) + #19 (página que lo usa).
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordDto } from '../models/user.dto';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/users/me';

  /** Devuelve los datos del usuario actualmente autenticado. */
  getProfile(): Observable<User> {
    return this.http.get<User>(this.base);
  }

  /**
   * Cambia la contraseña del usuario autenticado.
   * Errores comunes del backend:
   *  - 401 si currentPassword no coincide
   *  - 400 si newPassword < 6 caracteres o igual a la actual
   */
  changePassword(dto: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.base}/password`, dto);
  }
}
