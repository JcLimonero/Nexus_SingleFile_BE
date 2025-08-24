import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <p class="text-gray-600">Esta página está en construcción.</p>
    </div>
  `
})
export class UsuariosComponent {}
