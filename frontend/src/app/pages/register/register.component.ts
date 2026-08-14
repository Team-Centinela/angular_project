import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { extractErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  name = '';
  email = '';
  password = '';
  passwordConfirm = '';
  loading = signal(false);
  errorMsg = signal('');

  submit() {
    this.errorMsg.set('');
    if (!this.name.trim() || !this.email.trim() || !this.password) {
      this.errorMsg.set('Todos los campos son obligatorios');
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (this.password !== this.passwordConfirm) {
      this.errorMsg.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    this.authService
      .register({
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(extractErrorMessage(err, 'No se pudo registrar el usuario'));
        },
      });
  }
}
