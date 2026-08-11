import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="sidebar bg-light border-end p-3">
      <h5 class="mb-3">Menú</h5>
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link" routerLink="/">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/products">Productos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/categories">Categorías</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/favorites">Favoritos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/profile">Mi Perfil</a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      min-height: calc(100vh - 56px);
    }
  `]
})
export class SidebarComponent {}
