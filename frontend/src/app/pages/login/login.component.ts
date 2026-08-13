import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { extractErrorMessage } from '../../utils/error.util';
import { safeReturnUrl } from '../../utils/safe-return-url.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  loading = signal(false);
  errorMsg = signal('');

  submit() {
    this.errorMsg.set('');
    if (!this.email.trim() || !this.password) {
      this.errorMsg.set('Email y contraseña son obligatorios');
      return;
    }

    this.loading.set(true);
    this.authService
      .login({ email: this.email.trim(), password: this.password })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.loading.set(false);
          const safe = safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));
          this.router.navigateByUrl(safe);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(extractErrorMessage(err, 'No se pudo iniciar sesión'));
        },
      });
  }
}
