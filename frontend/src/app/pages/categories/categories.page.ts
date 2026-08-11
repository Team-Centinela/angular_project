import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.css',
})
export class CategoriesPage implements OnInit {
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

  openNew() {
    this.editingId = null;
    this.form = { name: '', description: '' };
    this.errorMsg = '';
    this.showForm = true;
  }

  openEdit(c: Category) {
    this.editingId = c.id;
    this.form = { name: c.name, description: c.description ?? '' };
    this.errorMsg = '';
    this.showForm = true;
  }

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
      error: (err) => {
        this.errorMsg = this.msg(err, 'No se pudo guardar la categoría');
      },
    });
  }

  delete(c: Category) {
    if (!confirm(`¿Eliminar "${c.name}"?`)) return;
    this.categoryService.delete(c.id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.errorMsg = this.msg(err, 'No se pudo eliminar la categoría');
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
