import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
})
export class ProfilePage implements OnInit {
  private userService = inject(UserService);

  user = signal<User | null>(null);
  loading = signal(false);
  errorMsg = '';
  successMsg = '';

  currentPassword = '';
  newPassword = '';
  newPassword2 = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.errorMsg = '';
    this.userService.getProfile().subscribe({
      next: (u) => {
        this.user.set(u);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg = 'No se pudo cargar el perfil';
        this.loading.set(false);
      },
    });
  }

  changePassword() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.currentPassword.length === 0) {
      this.errorMsg = 'Ingresa tu contraseña actual';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }
    if (this.newPassword !== this.newPassword2) {
      this.errorMsg = 'Las contraseñas nuevas no coinciden';
      return;
    }
    if (this.currentPassword === this.newPassword) {
      this.errorMsg = 'La nueva contraseña debe ser diferente a la actual';
      return;
    }

    this.userService
      .changePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: (r) => {
          this.successMsg = r.message;
          this.currentPassword = '';
          this.newPassword = '';
          this.newPassword2 = '';
        },
        error: (err) => {
          this.errorMsg = this.msg(err, 'No se pudo cambiar la contraseña');
        },
      });
  }

  private msg(err: any, fallback: string): string {
    const m = err?.error?.message;
    if (Array.isArray(m)) return m.join(', ');
    return m ?? fallback;
  }
}
