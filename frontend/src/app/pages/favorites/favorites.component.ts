/**
 * Página: FavoritesComponent
 * --------------------------------------------------------------
 * Página PROTEGIDA: debe ir detrás del Auth Guard (#28).
 * Lista los productos favoritos del usuario autenticado
 * y permite quitarlos.
 *
 * Issue relacionado: #18
 *
 * Decisiones técnicas:
 *  - Reutiliza el componente `ProductCard` de Sebastian (#10)
 *    en lugar de dibujar una tarjeta inline.
 *  - Al hacer click en una card se emite `productClick` con el id;
 *    la página navega al detalle del producto (cuando exista #23).
 *  - El botón "Quitar" está separado del card para que no se
 *    confunda con la navegación.
 *  - Patrón consistente con ProductsPage y CategoriesPage:
 *    signals para estado, takeUntilDestroyed, extractErrorMessage.
 */

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '../../components/ui/product-card/product-card.component';
import { Product } from '../../models/product';
import { FavoritesService } from '../../services/favorites.service';
import { extractErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);

  favorites = signal<Product[]>([]);
  loading = signal(false);
  errorMsg = signal('');

  ngOnInit() {
    this.load();
  }

  /** Pide al backend los productos favoritos del usuario. */
  load() {
    this.loading.set(true);
    this.favoritesService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.favorites.set(list);
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('No se pudieron cargar los favoritos');
          this.loading.set(false);
        },
      });
  }

  /** Quita un producto de los favoritos y recarga la lista. */
  quitar(p: Product) {
    this.favoritesService
      .remove(p.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (err) =>
          this.errorMsg.set(extractErrorMessage(err, 'No se pudo quitar de favoritos')),
      });
  }
}
