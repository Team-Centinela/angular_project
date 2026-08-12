/**
 * Página: ProductsComponent  (CRUD completo de productos)
 * --------------------------------------------------------------
 * Página PROTEGIDA: debe ir detrás del Auth Guard (#28) en
 * app.routes.ts. Permite listar, crear, editar y eliminar productos.
 *
 * Issues que cierra:
 *   - #16 — Crear página Products (CRUD)
 *   - #32 — Implementar CRUD de Products
 *
 * Stack:
 *   - Standalone component (Angular 18)
 *   - FormsModule + ngModel para los formularios (spec evalúa 2-way)
 *   - @if / @for de control flow (spec evalúa directivas nuevas)
 *   - currency pipe (spec evalúa Pipes)
 *   - inject() para DI
 *   - takeUntilDestroyed() para no dejar subscripciones vivas al destruir
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { extractErrorMessage } from '../../utils/error.util';

/** Estado del formulario (no usamos signals porque ngModel requiere propiedad). */
interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  // ---------- Inyección ----------
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  // ---------- Estado (signals para lectura) ----------
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  /** Mensaje de error como signal para consistencia con el resto. */
  errorMsg = signal('');
  showForm = false;
  editingId: string | null = null;
  imageUrl = '';

  // ---------- Estado del formulario (propiedad normal) ----------
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

  // ---------- Carga ----------

  /** Pide la lista de productos al backend. Pasa limit=1000 para traer todos. */
  loadProducts() {
    this.loading.set(true);
    this.productService
      .getAll(undefined, undefined, 1, 1000)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('No se pudieron cargar los productos');
          this.loading.set(false);
      },
    });
  }

  /** Pide las categorías para popular el <select>. */
  loadCategories() {
    this.categoryService.getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (cats) => this.categories.set(cats),
        error: () => this.errorMsg.set('No se pudieron cargar las categorías'),
      });
  }

  // ---------- Acciones ----------

  /** Abre el modal en modo CREAR. */
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
    this.errorMsg.set('');
    this.showForm = true;
  }

  /** Abre el modal en modo EDITAR. */
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
    this.errorMsg.set('');
    this.showForm = true;
  }

  /** Suma una URL al array de imágenes. */
  addImage() {
    const url = this.imageUrl.trim();
    if (!url) return;
    this.form.images.push(url);
    this.imageUrl = '';
  }

  /** Quita una imagen por índice. */
  removeImage(i: number) {
    this.form.images.splice(i, 1);
  }

  /** Valida y envía al backend (POST si crea, PATCH si edita). */
  save() {
    this.errorMsg.set('');
    if (this.form.name.length < 2) {
      this.errorMsg.set('El nombre es obligatorio (mín. 2 letras)');
      return;
    }
    if (this.form.price <= 0) {
      this.errorMsg.set('El precio debe ser mayor a 0');
      return;
    }
    if (this.form.stock < 0) {
      this.errorMsg.set('El stock no puede ser negativo');
      return;
    }
    if (!this.form.categoryId) {
      this.errorMsg.set('Selecciona una categoría');
      return;
    }

    const body = {
      name: this.form.name,
      description: this.form.description || undefined,
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      categoryId: this.form.categoryId,
      images: this.form.images.length ? this.form.images : undefined,
    };

    const id = this.editingId;
    const req$ = id
      ? this.productService.update(id, body)
      : this.productService.create(body);

    req$.pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        this.showForm = false;
        this.loadProducts();
      },
      error: (err) => {
        this.errorMsg.set(extractErrorMessage(err, 'No se pudo guardar el producto'));
      },
    });
  }

  /** Pide confirmación y elimina. */
  delete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    this.productService.delete(p.id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.loadProducts(),
        error: (err) => this.errorMsg.set(extractErrorMessage(err, 'No se pudo eliminar')),
      });
  }

  /** Cierra el modal sin guardar. */
  cancel() {
    this.showForm = false;
  }
}