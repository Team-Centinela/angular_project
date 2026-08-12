import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/ui/product-card/product-card.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { SearchBarComponent } from '../../components/ui/search-bar/search-bar.component';
import { extractErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingComponent, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  readonly searchText = signal('');
  readonly selectedCategory = signal('');
  readonly categories = signal<Category[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loadCategories();

    effect(() => {
      const search = this.searchText();
      const categoryId = this.selectedCategory();
      this.loadProducts(search, categoryId);
    }, { allowSignalWrites: true });
  }

  onProductClick(id: string): void {
    console.log('Product clicked:', id);
  }

  private loadCategories(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (cats) => this.categories.set(cats),
        error: (err) => {
          this.errorMessage.set(extractErrorMessage(err, 'No se pudieron cargar las categorías'));
          this.categories.set([]);
        }
      });
  }

  private loadProducts(search: string, categoryId: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.productService
      .getAll(search || undefined, categoryId || undefined)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.products.set(response.data);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(extractErrorMessage(err, 'No se pudieron cargar los productos. Intenta de nuevo.'));
          this.products.set([]);
          this.loading.set(false);
        }
      });
  }
}
