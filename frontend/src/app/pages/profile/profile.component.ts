import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="container py-4">
      <h1>Mi Perfil</h1>
      <p>Información de tu cuenta</p>
    </div>
  `
})
export class ProfileComponent {}
