import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'vex-validacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  templateUrl: './validacion.component.html',
  styleUrl: './validacion.component.scss'
})
export class ValidacionComponent implements OnInit {
  loading = false;
  
  // Filtros principales
  selectedAgency = 'honda-galeria';
  selectedProcess = 'autos-nuevos';
  selectedFase = '';

  // Tabla de clientes
  clientesDisplayedColumns: string[] = [
    'ndCliente', 'ndPedido', 'cliente', 'proceso', 'operacion', 
    'integracion', 'liquidacion', 'liberacion', 'excepcion', 'liberado', 'registro'
  ];
  clientesDataSource: any[] = [];

  // Tabla de documentos
  documentosDisplayedColumns: string[] = [
    'proceso', 'fase', 'documento', 'estatus', 'ver', 'validar', 
    'eliminar', 'requerido', 'fecha', 'comentario', 'asignado'
  ];
  documentosDataSource: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    // Simular carga de datos
    setTimeout(() => {
      // Datos de clientes basados en la imagen
      this.clientesDataSource = [
        {
          ndCliente: 197697,
          ndPedido: 34910,
          cliente: 'COMERCIALIZADORA AVODICARE SA DE AUTOS NUEVOS',
          proceso: 'AUTOS NUEVOS',
          operacion: 'CONTADO',
          integracion: true,
          liquidacion: false,
          liberacion: true,
          excepcion: false,
          liberado: false,
          registro: '29/08/2025'
        },
        {
          ndCliente: 180783,
          ndPedido: 31959,
          cliente: 'EDGAR GERARDO AGUAYO NUÑO',
          proceso: 'AUTOS NUEVOS',
          operacion: 'HONDA FINANCE',
          integracion: true,
          liquidacion: false,
          liberacion: false,
          excepcion: false,
          liberado: false,
          registro: '08/09/2023'
        },
        {
          ndCliente: 195432,
          ndPedido: 32876,
          cliente: 'MARIA ISABEL RODRIGUEZ LOPEZ',
          proceso: 'AUTOS NUEVOS',
          operacion: 'CREDITO INTERNO',
          integracion: false,
          liquidacion: false,
          liberacion: false,
          excepcion: false,
          liberado: false,
          registro: '15/08/2025'
        }
      ];

      // Datos de documentos basados en la imagen
      this.documentosDataSource = [
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Integración',
          documento: 'ACTA CONSTITUTIVA',
          estatus: 'info',
          ver: true,
          validado: false,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        },
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Integración',
          documento: 'COMPROBANTE DE DOMICILIO',
          estatus: 'info',
          ver: true,
          validado: true,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        },
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Liquidación',
          documento: 'FACTURA',
          estatus: 'info',
          ver: true,
          validado: false,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        },
        {
          proceso: 'AUTOS NUEVOS',
          fase: 'Liberación',
          documento: 'LEY ANTILAVADO',
          estatus: 'info',
          ver: true,
          validado: false,
          eliminar: true,
          requerido: true,
          fecha: '29/08/2025',
          comentario: '',
          asignado: ''
        }
      ];

      this.loading = false;
    }, 1000);
  }

  // Métodos para estadísticas
  getIntegradosCount(): number {
    return this.clientesDataSource.filter(item => item.integracion).length;
  }

  getPendientesCount(): number {
    return this.clientesDataSource.filter(item => !item.integracion).length;
  }

  // Métodos de acción
  validarDocumento(id: number) {
    console.log('Validando documento:', id);
    // Implementar lógica de validación
  }

  rechazarDocumento(id: number) {
    console.log('Rechazando documento:', id);
    // Implementar lógica de rechazo
  }

  descargarArchivo() {
    console.log('Descargando archivo...');
    // Implementar lógica de descarga
  }

  cancelarProceso() {
    console.log('Cancelando proceso...');
    // Implementar lógica de cancelación
  }

  crearExcepcion() {
    console.log('Creando excepción...');
    // Implementar lógica de excepción
  }
}
