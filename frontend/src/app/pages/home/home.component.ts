import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductCardComponent } from '../../components/ui/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly searchText = signal('');
  readonly selectedCategory = signal('');
  loading: boolean = false;

  readonly categories: Category[] = [
    { id: 'c1', name: 'Electrónica', description: 'Productos electrónicos', createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-03-12T15:30:00Z' },
    { id: 'c2', name: 'Ropa', description: 'Prendas de vestir', createdAt: '2024-02-05T09:00:00Z', updatedAt: '2024-05-22T11:45:00Z' },
    { id: 'c3', name: 'Hogar', description: 'Artículos para el hogar', createdAt: '2024-03-01T08:00:00Z', updatedAt: '2024-06-15T17:00:00Z' }
  ];

  readonly products = signal<Product[]>([
    { id: '1', name: 'Laptop HP', description: 'Laptop 15 pulgadas', price: 1200, stock: 5, categoryId: 'c1', category: this.categories[0], images: [], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-04-20T14:00:00Z' },
    { id: '2', name: 'Auriculares', description: 'Auriculares inalámbricos', price: 50, stock: 20, categoryId: 'c1', category: this.categories[0], images: [], createdAt: '2024-02-02T09:30:00Z', updatedAt: '2024-04-05T11:20:00Z' },
    { id: '3', name: 'Camiseta', description: 'Camiseta de algodón', price: 15, stock: 30, categoryId: 'c2', category: this.categories[1], images: [], createdAt: '2024-03-12T13:00:00Z', updatedAt: '2024-05-18T16:00:00Z' },
    { id: '4', name: 'Sofá', description: 'Sofá de 3 puestos', price: 500, stock: 2, categoryId: 'c3', category: this.categories[2], images: [], createdAt: '2024-01-22T08:00:00Z', updatedAt: '2024-06-10T10:15:00Z' }
  ]);

  readonly filteredProducts = computed(() => {
    const search = this.searchText().toLowerCase();
    const catId = this.selectedCategory();
    return this.products().filter(p => {
      const matchesSearch = this.searchText() === '' ||
        p.name.toLowerCase().includes(search) ||
        (p.description ?? '').toLowerCase().includes(search);
      const matchesCategory = catId === '' || p.categoryId === catId;
      return matchesSearch && matchesCategory;
    });
  });

  onProductClick(id: string) {
    console.log('Product clicked:', id);
    // TODO: navegar a /products/:id cuando exista la página de detalle
  }
}
