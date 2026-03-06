import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { ValidacionService, DatosIdentificacion } from '../validacion.service';

registerLocaleData(localeEsMx, 'es-MX');

export interface DatosIdentificacionDialogData {
  idFile: number;
  cliente: string;
  item?: any;
}

export interface DatosIdentificacionDialogResult {
  guardado?: boolean;
  imprimir?: boolean;
}

@Component({
  selector: 'app-datos-identificacion-dialog',
  templateUrl: './datos-identificacion-dialog.component.html',
  styleUrls: ['./datos-identificacion-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-MX' }]
})
export class DatosIdentificacionDialogComponent implements OnInit {
  form!: FormGroup;
  loading = true;
  saving = false;
  idClient: number | null = null;
  idCustomerType = 0;
  isClienteMoral = false;

  constructor(
    public dialogRef: MatDialogRef<DatosIdentificacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosIdentificacionDialogData,
    private validacionService: ValidacionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [''],
      apellido_paterno: [''],
      apellido_materno: [''],
      razon_social: [''],
      rfc: [''],
      curp: [''],
      email: [''],
      telefono: [''],
      telefono2: [''],
      calle: [''],
      numero_exterior: [''],
      numero_interior: [''],
      colonia: [''],
      codigo_postal: [''],
      ciudad: [''],
      municipio: [''],
      pais: [''],
      fecha_nacimiento: [null as string | null],
      pais_nacimiento: [''],
      pais_nacionalidad: [''],
      autoridad_emite: [''],
      fecha_constituccion: [null as string | null],
      actividad_giro: ['']
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.validacionService.getDatosIdentificacion(this.data.idFile).subscribe({
      next: (d) => {
        this.idClient = d.idClient ?? null;
        this.idCustomerType = d.idCustomerType ?? 0;
        this.isClienteMoral = this.idCustomerType === 3;
        const toDate = (s: string | null | undefined): Date | null => {
          if (!s) return null;
          const d = new Date(s);
          return isNaN(d.getTime()) ? null : d;
        };
        this.form.patchValue({
          nombre: d.nombre ?? '',
          apellido_paterno: d.apellido_paterno ?? '',
          apellido_materno: d.apellido_materno ?? '',
          razon_social: d.razon_social ?? '',
          rfc: d.rfc ?? '',
          curp: d.curp ?? '',
          email: d.email ?? '',
          telefono: d.telefono ?? '',
          telefono2: d.telefono2 ?? '',
          calle: d.calle ?? '',
          numero_exterior: d.numero_exterior ?? '',
          numero_interior: d.numero_interior ?? '',
          colonia: d.colonia ?? '',
          codigo_postal: d.codigo_postal ?? '',
          ciudad: d.ciudad ?? '',
          municipio: d.municipio ?? '',
          pais: d.pais ?? '',
          fecha_nacimiento: toDate(d.fecha_nacimiento ?? null),
          pais_nacimiento: d.pais_nacimiento ?? '',
          pais_nacionalidad: d.pais_nacionalidad ?? '',
          autoridad_emite: d.autoridad_emite ?? '',
          fecha_constituccion: toDate(d.fecha_constituccion ?? null),
          actividad_giro: d.actividad_giro ?? ''
        });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al cargar datos', 'Cerrar', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  getFormData(): Partial<DatosIdentificacion> {
    const v = this.form.value;
    return {
      nombre: v.nombre || null,
      apellido_paterno: v.apellido_paterno || null,
      apellido_materno: v.apellido_materno || null,
      razon_social: v.razon_social || null,
      rfc: v.rfc || null,
      curp: v.curp || null,
      email: v.email || null,
      telefono: v.telefono || null,
      telefono2: v.telefono2 || null,
      calle: v.calle || null,
      numero_exterior: v.numero_exterior || null,
      numero_interior: v.numero_interior || null,
      colonia: v.colonia || null,
      codigo_postal: v.codigo_postal || null,
      ciudad: v.ciudad || null,
      municipio: v.municipio || null,
      pais: v.pais || null,
      fecha_nacimiento: v.fecha_nacimiento ? (typeof v.fecha_nacimiento === 'string' ? v.fecha_nacimiento : v.fecha_nacimiento?.toISOString?.()?.split('T')[0]) : null,
      pais_nacimiento: v.pais_nacimiento || null,
      pais_nacionalidad: v.pais_nacionalidad || null,
      autoridad_emite: v.autoridad_emite || null,
      fecha_constituccion: v.fecha_constituccion ? (typeof v.fecha_constituccion === 'string' ? v.fecha_constituccion : v.fecha_constituccion?.toISOString?.()?.split('T')[0]) : null,
      actividad_giro: v.actividad_giro || null
    };
  }

  guardar(): void {
    if (!this.idClient) {
      this.snackBar.open('No se pudo obtener el cliente', 'Cerrar', { duration: 3000 });
      return;
    }
    this.saving = true;
    const data = this.getFormData();
    this.validacionService.saveDatosIdentificacion(this.idClient, data, this.data.idFile).subscribe({
      next: () => {
        this.snackBar.open('Datos guardados correctamente', 'Cerrar', { duration: 3000 });
        this.saving = false;
        this.dialogRef.close({ guardado: true });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al guardar', 'Cerrar', { duration: 4000 });
        this.saving = false;
      }
    });
  }

  guardarEImprimir(): void {
    if (!this.idClient) {
      this.snackBar.open('No se pudo obtener el cliente', 'Cerrar', { duration: 3000 });
      return;
    }
    this.saving = true;
    const data = this.getFormData();
    this.validacionService.saveDatosIdentificacion(this.idClient, data, this.data.idFile).subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close({ guardado: true, imprimir: true });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al guardar', 'Cerrar', { duration: 4000 });
        this.saving = false;
      }
    });
  }

  imprimirSinEditar(): void {
    this.dialogRef.close({ imprimir: true });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
