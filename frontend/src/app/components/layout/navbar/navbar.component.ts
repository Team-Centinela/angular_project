import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private layoutService = inject(LayoutService);

  isAuthenticated$ = this.authService.isAuthenticated$;
  isSidebarOpen = this.layoutService.isSidebarOpen;
  isMenuOpen = signal(false);

  get userName(): string | null {
    return this.authService.getUser()?.name ?? null;
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout().subscribe();
  }
}
