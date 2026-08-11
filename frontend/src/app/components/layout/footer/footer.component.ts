import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-dark text-white text-center py-3 mt-auto">
      <div class="container">
        <p class="mb-0">Sistema de Gestión de Productos - Team Centinela</p>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: auto;
    }
  `]
})
export class FooterComponent {}
