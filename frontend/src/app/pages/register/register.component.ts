import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <h1>Registrarse</h1>
      <p>Formulario de registro</p>
    </div>
  `
})
export class RegisterComponent {}