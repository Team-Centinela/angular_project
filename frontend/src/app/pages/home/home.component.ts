import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { Category } from '../../models/category';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchText: string = '';
  selectedCategory: string = '';
  loading: boolean = false;

  categories: Category[] = [
    { id: 'c1', name: 'Electrónica', description: 'Productos electrónicos', createdAt: '', updatedAt: '' },
    { id: 'c2', name: 'Ropa', description: 'Prendas de vestir', createdAt: '', updatedAt: '' },
    { id: 'c3', name: 'Hogar', description: 'Artículos para el hogar', createdAt: '', updatedAt: '' }
  ];

  products: Product[] = [
    { id: '1', name: 'Laptop HP', description: 'Laptop 15 pulgadas', price: 1200, stock: 5, categoryId: 'c1', category: this.categories[0], images: [], createdAt: '', updatedAt: '' },
    { id: '2', name: 'Auriculares', description: 'Auriculares inalámbricos', price: 50, stock: 20, categoryId: 'c1', category: this.categories[0], images: [], createdAt: '', updatedAt: '' },
    { id: '3', name: 'Camiseta', description: 'Camiseta de algodón', price: 15, stock: 30, categoryId: 'c2', category: this.categories[1], images: [], createdAt: '', updatedAt: '' },
    { id: '4', name: 'Sofá', description: 'Sofá de 3 puestos', price: 500, stock: 2, categoryId: 'c3', category: this.categories[2], images: [], createdAt: '', updatedAt: '' }
  ];

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = this.searchText === '' ||
        p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.categoryId === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}
