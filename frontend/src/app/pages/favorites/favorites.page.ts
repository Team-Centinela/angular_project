import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.page.html',
  styleUrl: './favorites.page.css',
})
export class FavoritesPage implements OnInit {
  private favoritesService = inject(FavoritesService);

  favorites = signal<Product[]>([]);
  loading = signal(false);
  errorMsg = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.favoritesService.getAll().subscribe({
      next: (list) => {
        this.favorites.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los favoritos';
        this.loading.set(false);
      },
    });
  }

  quitar(p: Product) {
    this.favoritesService.remove(p.id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'No se pudo quitar de favoritos';
      },
    });
  }

  primeraImagen(p: Product): string {
    return p.images?.length ? p.images[0].url : '';
  }
}
