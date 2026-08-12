import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isAuthenticated$ = this.authService.isAuthenticated$;

  get userName(): string | null {
    return this.authService.getUser()?.name ?? null;
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
