import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-material-example',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule
  ],
  templateUrl: './material-example.component.html',
  styleUrl: './material-example.component.scss'
})
export class MaterialExampleComponent {
  nombre: string = '';
  
  saludar() {
    if (this.nombre.trim()) {
      alert(`¡Hola ${this.nombre}! Bienvenido a Angular Material`);
    }
  }
}
