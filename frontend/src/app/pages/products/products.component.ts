/**
 * Página: ProductsComponent  (CRUD completo de productos)
 * --------------------------------------------------------------
 * Página PROTEGIDA: debe ir detrás del Auth Guard (#28) en
 * app.routes.ts. Permite listar, crear, editar y eliminar productos.
 *
 * Issues que cierra:
 *   - #16 — Crear página Products (CRUD)
 *   - #32 — Implementar CRUD de Products
 *   - #59 — UI de paginación en Products CRUD
 *
 * Stack:
 *   - Standalone component (Angular 18)
 *   - FormsModule + ngModel para los formularios (spec evalúa 2-way)
 *   - @if / @for de control flow (spec evalúa directivas nuevas)
 *   - currency pipe (spec evalúa Pipes)
 *   - inject() para DI
 *   - takeUntilDestroyed() para no dejar subscripciones vivas al destruir
 *
 * Decisiones de paginación (issue #59):
 *   - pageSize por defecto = 10 (alineado con el default del backend).
 *   - El usuario puede elegir 10 / 25 / 50 / 100 vía <select>.
 *   - Cuando cambia pageSize, se resetea a la página 1 (no tiene sentido
 *     pedir "página 5 de 100" si pasamos a "10 por página").
 *   - Cuando eliminamos un producto, recalculamos la página actual:
 *     si la página quedó vacía (porque borramos el último elemento),
 *     retrocedemos una página para evitar mostrar tabla vacía.
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

/** Tamaños de página que el usuario puede elegir en el <select>. */
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

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

  // ---------- Estado de paginación (issue #59) ----------
  /** Página actual, 1-based (la primera página es 1, no 0). */
  currentPage = signal(1);
  /** Tamaño de página actual. Inicia en 10 (default del backend). */
  pageSize = signal<number>(10);
  /** Total de productos que existen en el backend (no solo en esta página). */
  total = signal(0);
  /** Total de páginas calculado: ceil(total / pageSize). */
  totalPages = signal(0);
  /** Opciones que mostraremos en el <select> de tamaño de página. */
  pageSizeOptions = PAGE_SIZE_OPTIONS;

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

  /**
   * Pide la lista de productos al backend respetando paginación.
   * El backend devuelve { data, total, page, limit, totalPages }; solo
   * guardamos lo que necesitamos para mostrar la tabla y los controles.
   */
  loadProducts() {
    this.loading.set(true);
    this.productService
      .getAll(undefined, undefined, this.currentPage(), this.pageSize())
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.total.set(res.total);
          this.totalPages.set(res.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('No se pudieron cargar los productos');
          this.loading.set(false);
        },
      });
  }

  /** Pide las categorías para popular el <select> del modal. */
  loadCategories() {
    this.categoryService.getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (cats) => this.categories.set(cats),
        error: () => this.errorMsg.set('No se pudieron cargar las categorías'),
      });
  }

  // ---------- Controles de paginación ----------

  /** Va a la primera página (botón |<). */
  goFirst() {
    if (this.currentPage() === 1) return;
    this.currentPage.set(1);
    this.loadProducts();
  }

  /** Retrocede una página (botón <). Deshabilitado si ya estamos en la primera. */
  goPrev() {
    if (this.currentPage() <= 1) return;
    this.currentPage.update((p) => p - 1);
    this.loadProducts();
  }

  /** Avanza una página (botón >). Deshabilitado si ya estamos en la última. */
  goNext() {
    if (this.currentPage() >= this.totalPages()) return;
    this.currentPage.update((p) => p + 1);
    this.loadProducts();
  }

  /** Va a la última página (botón >|). */
  goLast() {
    if (this.currentPage() === this.totalPages()) return;
    this.currentPage.set(this.totalPages());
    this.loadProducts();
  }

  /**
   * Cambia el tamaño de página. Resetea a la página 1 porque las posiciones
   * anteriores dejan de tener sentido (la "página 5 con 100 items" ahora
   * contiene productos distintos a la "página 5 con 10 items").
   */
  onPageSizeChange() {
    this.currentPage.set(1);
    this.loadProducts();
  }

  // ---------- Acciones del modal ----------

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

  /**
   * Pide confirmación y elimina.
   *
   * Edge case: si borramos el último elemento de la última página,
   * la página actual queda vacía. Solución: detectarlo y pedir
   * `currentPage - 1` para que la tabla siempre tenga al menos
   * un ítem visible (si existe).
   */
  delete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    this.productService.delete(p.id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          // Si era el último elemento de la última página, retrocede.
          if (
            this.products().length === 1 &&
            this.currentPage() > 1
          ) {
            this.currentPage.update((page) => page - 1);
          }
          this.loadProducts();
        },
        error: (err) => this.errorMsg.set(extractErrorMessage(err, 'No se pudo eliminar')),
      });
  }

  /** Cierra el modal sin guardar. */
  cancel() {
    this.showForm = false;
  }
}
