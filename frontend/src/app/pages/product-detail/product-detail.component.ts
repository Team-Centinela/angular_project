import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Product } from '../../models/product';
import { extractErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);

  product = signal<Product | null>(null);
  loading = signal(false);
  errorMsg = signal('');
  message = signal('');

  isAuthenticated$ = this.authService.isAuthenticated$;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    this.loading.set(true);
    this.productService.getOne(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (p) => {
          this.product.set(p);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMsg.set(extractErrorMessage(err, 'Producto no encontrado'));
          this.loading.set(false);
        }
      });
  }

  addToFavorite() {
    const p = this.product();
    if (!p) return;
    this.errorMsg.set('');
    this.message.set('');
    this.favoritesService.add(p.id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.message.set('Agregado a favoritos'),
        error: (err) => this.errorMsg.set(extractErrorMessage(err, 'No se pudo agregar a favoritos')),
      });
  }

  removeFromFavorite() {
    const p = this.product();
    if (!p) return;
    this.errorMsg.set('');
    this.message.set('');
    this.favoritesService.remove(p.id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.message.set('Removido de favoritos'),
        error: (err) => this.errorMsg.set(extractErrorMessage(err, 'No se pudo quitar de favoritos')),
      });
  }
}
