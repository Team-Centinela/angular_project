/**
 * Página: CategoriesComponent  (CRUD completo de categorías)
 * --------------------------------------------------------------
 * Página PROTEGIDA: debe ir detrás del Auth Guard (#28).
 *
 * Issues que cierra:
 *   - #17 — Crear página Categories (CRUD)
 *   - #33 — Implementar CRUD de Categories
 *
 * Variantes respecto a #16/#32 (Products):
 *  - Solo dos campos (name + description).
 *  - Sin imágenes, sin precio, sin stock.
 *  - Backend puede devolver 409 al eliminar si tiene productos asociados.
 */

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { extractErrorMessage } from '../../utils/error.util';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private destroyRef = inject(DestroyRef);

  categories = signal<Category[]>([]);
  loading = signal(false);
  /** Mensaje de error como signal para consistencia con el resto. */
  errorMsg = signal('');
  showForm = false;
  editingId: string | null = null;

  form: { name: string; description: string } = { name: '', description: '' };

  ngOnInit() {
    this.loadAll();
  }

  /** Pide todas las categorías al backend. */
  loadAll() {
    this.loading.set(true);
    this.categoryService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cats) => {
          this.categories.set(cats);
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('No se pudieron cargar las categorías');
          this.loading.set(false);
        },
      });
  }

  /** Abre el modal en modo CREAR. */
  openNew() {
    this.editingId = null;
    this.form = { name: '', description: '' };
    this.errorMsg.set('');
    this.showForm = true;
  }

  /** Abre el modal en modo EDITAR. */
  openEdit(c: Category) {
    this.editingId = c.id;
    this.form = { name: c.name, description: c.description ?? '' };
    this.errorMsg.set('');
    this.showForm = true;
  }

  /** Cierra el modal sin guardar. */
  cancel() {
    this.showForm = false;
  }

  /** Valida y envía al backend. */
  save() {
    this.errorMsg.set('');
    if (this.form.name.length < 2) {
      this.errorMsg.set('El nombre es obligatorio (mín. 2 letras)');
      return;
    }
    const body = {
      name: this.form.name,
      description: this.form.description || undefined,
    };
    const id = this.editingId;
    const req$ = id
      ? this.categoryService.update(id, body)
      : this.categoryService.create(body);
    req$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.showForm = false;
        this.loadAll();
      },
      error: (err) =>
        this.errorMsg.set(extractErrorMessage(err, 'No se pudo guardar la categoría')),
    });
  }

  /** Pide confirmación y elimina. Si tiene productos asociados → 409. */
  delete(c: Category) {
    if (!confirm(`¿Eliminar "${c.name}"?`)) return;
    this.categoryService.delete(c.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadAll(),
        error: (err) =>
          this.errorMsg.set(extractErrorMessage(err, 'No se pudo eliminar la categoría')),
      });
  }
}