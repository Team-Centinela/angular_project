import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import {
  CreateProductDto,
  Product,
} from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.page.html',
  styleUrl: './products.page.css',
})
export class ProductsPage implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  errorMsg = '';
  showForm = false;
  editingId: string | null = null;
  imageUrl = '';

  form: ProductForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    images: [],
  };

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los productos';
        this.loading.set(false);
      },
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => (this.errorMsg = 'No se pudieron cargar las categorías'),
    });
  }

  openNew() {
    this.editingId = null;
    this.form = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      images: [],
    };
    this.errorMsg = '';
    this.showForm = true;
  }

  openEdit(p: Product) {
    this.editingId = p.id;
    this.form = {
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId,
      images: (p.images ?? []).map((i) => i.url),
    };
    this.errorMsg = '';
    this.showForm = true;
  }

  addImage() {
    const url = this.imageUrl.trim();
    if (!url) return;
    this.form.images.push(url);
    this.imageUrl = '';
  }

  removeImage(i: number) {
    this.form.images.splice(i, 1);
  }

  save() {
    this.errorMsg = '';
    if (this.form.name.length < 2) {
      this.errorMsg = 'El nombre es obligatorio (mín. 2 letras)';
      return;
    }
    if (this.form.price <= 0) {
      this.errorMsg = 'El precio debe ser mayor a 0';
      return;
    }
    if (this.form.stock < 0) {
      this.errorMsg = 'El stock no puede ser negativo';
      return;
    }
    if (!this.form.categoryId) {
      this.errorMsg = 'Selecciona una categoría';
      return;
    }

    const id = this.editingId;
    const body: CreateProductDto = {
      name: this.form.name,
      description: this.form.description || undefined,
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      categoryId: this.form.categoryId,
      images: this.form.images.length ? this.form.images : undefined,
    };

    const req$ = id
      ? this.productService.update(id, body)
      : this.productService.create(body);

    req$.subscribe({
      next: () => {
        this.showForm = false;
        this.loadProducts();
      },
      error: (err) => {
        this.errorMsg = this.msg(err, 'No se pudo guardar el producto');
      },
    });
  }

  delete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    this.productService.delete(p.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.errorMsg = this.msg(err, 'No se pudo eliminar');
      },
    });
  }

  cancel() {
    this.showForm = false;
  }

  private msg(err: any, fallback: string): string {
    const m = err?.error?.message;
    if (Array.isArray(m)) return m.join(', ');
    return m ?? fallback;
  }
}
