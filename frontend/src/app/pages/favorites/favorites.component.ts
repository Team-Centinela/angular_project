import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  template: `
    <div class="container py-4">
      <h1>Favoritos</h1>
      <p>Tus productos favoritos</p>
    </div>
  `
})
export class FavoritesComponent {}
