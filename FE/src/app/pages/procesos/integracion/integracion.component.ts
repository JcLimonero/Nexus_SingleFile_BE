import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-integracion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './integracion.component.html',
  styleUrls: ['./integracion.component.scss']
})
export class IntegracionComponent implements OnInit {
  loading = false;
  integrationStatus = 'inactive'; // inactive, active, error
  lastUpdate = new Date();

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadIntegrationStatus();
  }

  loadIntegrationStatus(): void {
    this.loading = true;
    // Simular carga de estado de integración
    setTimeout(() => {
      this.integrationStatus = 'active';
      this.loading = false;
    }, 1000);
  }

  startIntegration(): void {
    this.loading = true;
    this.snackBar.open('Iniciando proceso de integración...', 'Cerrar', {
      duration: 3000
    });
    
    // Simular proceso de integración
    setTimeout(() => {
      this.integrationStatus = 'active';
      this.loading = false;
      this.snackBar.open('Integración completada exitosamente', 'Cerrar', {
        duration: 5000
      });
    }, 3000);
  }

  stopIntegration(): void {
    this.integrationStatus = 'inactive';
    this.snackBar.open('Integración detenida', 'Cerrar', {
      duration: 3000
    });
  }

  getStatusColor(): string {
    switch (this.integrationStatus) {
      case 'active': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStatusIcon(): string {
    switch (this.integrationStatus) {
      case 'active': return 'check_circle';
      case 'error': return 'error';
      default: return 'pause_circle';
    }
  }

  getStatusText(): string {
    switch (this.integrationStatus) {
      case 'active': return 'Activa';
      case 'error': return 'Error';
      default: return 'Inactiva';
    }
  }
}
