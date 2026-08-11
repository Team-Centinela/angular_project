import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container py-4">
      <h1>Inicio</h1>
      <p>Bienvenido al Sistema de Gestión de Productos</p>
    </div>
  `
})
export class HomeComponent {}
