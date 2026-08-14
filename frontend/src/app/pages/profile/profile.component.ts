/**
 * Página: ProfileComponent
 * --------------------------------------------------------------
 * Página PROTEGIDA: debe ir detrás del Auth Guard (#28).
 * Muestra la información del usuario autenticado y permite
 * cambiar la contraseña.
 *
 * Issue relacionado: #19
 *
 * Decisiones técnicas:
 *  - Estado de lectura como signals (loading, user, errorMsg).
 *  - Form fields como propiedades planas (ngModel no funciona directo
 *    con signals).
 *  - Validación cliente antes de mandar al backend (UX).
 *  - `date` pipe para createdAt (requisito de Pipes del spec).
 *  - `takeUntilDestroyed(this.destroyRef)` en todas las subscripciones.
 *  - `extractErrorMessage()` para mensajes del backend (NestJS).
 *
 *  No incluye botón de Logout porque está en su propia issue (#34).
 */

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { extractErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  /** Datos del usuario autenticado (null mientras carga). */
  user = signal<User | null>(null);
  /** Loading mientras llega la respuesta. */
  loading = signal(false);
  /** Mensaje de error a mostrar al usuario. */
  errorMsg = signal('');
  /** Mensaje de éxito tras cambiar la contraseña. */
  successMsg = signal('');

  /** Estado del formulario (propiedades planas por ngModel). */
  currentPassword = '';
  newPassword = '';
  newPassword2 = '';

  ngOnInit() {
    this.load();
  }

  /** Pide al backend el perfil del usuario autenticado. */
  load() {
    this.loading.set(true);
    this.errorMsg.set('');
    this.userService
      .getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => {
          this.user.set(u);
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('No se pudo cargar el perfil');
          this.loading.set(false);
        },
      });
  }

  /**
   * Valida el formulario, llama al backend y muestra el resultado.
   * Limpia los campos del form en caso de éxito.
   */
  changePassword() {
    // Limpiamos mensajes previos.
    this.errorMsg.set('');
    this.successMsg.set('');

    // --- Validación cliente ---
    if (this.currentPassword.length === 0) {
      this.errorMsg.set('Ingresa tu contraseña actual');
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.newPassword !== this.newPassword2) {
      this.errorMsg.set('Las contraseñas nuevas no coinciden');
      return;
    }
    if (this.currentPassword === this.newPassword) {
      this.errorMsg.set('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    this.userService
      .changePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.successMsg.set(r.message);
          this.currentPassword = '';
          this.newPassword = '';
          this.newPassword2 = '';
        },
        error: (err) => {
          this.errorMsg.set(
            extractErrorMessage(err, 'No se pudo cambiar la contraseña'),
          );
        },
      });
  }
}