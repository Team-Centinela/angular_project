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
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(false);
  errorMsg = '';
  showForm = false;
  editingId: string | null = null;

  form: { name: string; description: string } = { name: '', description: '' };

  ngOnInit() {
    this.loadAll();
  }

  /** Pide todas las categorías al backend. */
  loadAll() {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar las categorías';
        this.loading.set(false);
      },
    });
  }

  /** Abre el modal en modo CREAR. */
  openNew() {
    this.editingId = null;
    this.form = { name: '', description: '' };
    this.errorMsg = '';
    this.showForm = true;
  }

  /** Abre el modal en modo EDITAR. */
  openEdit(c: Category) {
    this.editingId = c.id;
    this.form = { name: c.name, description: c.description ?? '' };
    this.errorMsg = '';
    this.showForm = true;
  }

  /** Cierra el modal sin guardar. */
  cancel() {
    this.showForm = false;
  }

  /** Valida y envía al backend. */
  save() {
    this.errorMsg = '';
    if (this.form.name.length < 2) {
      this.errorMsg = 'El nombre es obligatorio (mín. 2 letras)';
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
    req$.subscribe({
      next: () => {
        this.showForm = false;
        this.loadAll();
      },
      error: (err) => this.errorMsg = this.msg(err, 'No se pudo guardar la categoría'),
    });
  }

  /** Pide confirmación y elimina. Si tiene productos asociados → 409. */
  delete(c: Category) {
    if (!confirm(`¿Eliminar "${c.name}"?`)) return;
    this.categoryService.delete(c.id).subscribe({
      next: () => this.loadAll(),
      error: (err) => this.errorMsg = this.msg(err, 'No se pudo eliminar la categoría'),
    });
  }

  /** Extrae un mensaje legible desde un error HTTP de NestJS. */
  private msg(err: any, fallback: string): string {
    const m = err?.error?.message;
    if (Array.isArray(m)) return m.join(', ');
    return m ?? fallback;
  }
}
