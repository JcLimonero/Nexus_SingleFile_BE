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
      last_name: [''],
      mother_last_name: [''],
      business_name: [''],
      rfc: [''],
      curp: [''],
      email: [''],
      telefono: [''],
      telefono2: [''],
      calle: [''],
      external_number: [''],
      internal_number: [''],
      colonia: [''],
      postal_code: [''],
      ciudad: [''],
      municipio: [''],
      pais: [''],
      birth_date: [null as string | null],
      birth_country: [''],
      nationality_country: [''],
      issuing_authority: [''],
      incorporation_date: [null as string | null],
      business_activity: ['']
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.validacionService.getDatosIdentificacion(this.data.idFile).subscribe({
      next: (d) => {
        this.idClient = d.idClient ?? null;
        this.idCustomerType = d.idCustomerType ?? 0;
        this.isClienteMoral = this.idCustomerType === 2; // 2 = Persona Moral (1 = Persona Física)
        const toDate = (s: string | null | undefined): Date | null => {
          if (!s) return null;
          const d = new Date(s);
          return isNaN(d.getTime()) ? null : d;
        };
        this.form.patchValue({
          nombre: d.nombre ?? '',
          last_name: d.last_name ?? '',
          mother_last_name: d.mother_last_name ?? '',
          business_name: d.business_name ?? '',
          rfc: d.rfc ?? '',
          curp: d.curp ?? '',
          email: d.email ?? '',
          telefono: d.telefono ?? '',
          telefono2: d.telefono2 ?? '',
          calle: d.calle ?? '',
          external_number: d.external_number ?? '',
          internal_number: d.internal_number ?? '',
          colonia: d.colonia ?? '',
          postal_code: d.postal_code ?? '',
          ciudad: d.ciudad ?? '',
          municipio: d.municipio ?? '',
          pais: d.pais ?? '',
          birth_date: toDate(d.birth_date ?? null),
          birth_country: d.birth_country ?? '',
          nationality_country: d.nationality_country ?? '',
          issuing_authority: d.issuing_authority ?? '',
          incorporation_date: toDate(d.incorporation_date ?? null),
          business_activity: d.business_activity ?? ''
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
      last_name: v.last_name || null,
      mother_last_name: v.mother_last_name || null,
      business_name: v.business_name || null,
      rfc: v.rfc || null,
      curp: v.curp || null,
      email: v.email || null,
      telefono: v.telefono || null,
      telefono2: v.telefono2 || null,
      calle: v.calle || null,
      external_number: v.external_number || null,
      internal_number: v.internal_number || null,
      colonia: v.colonia || null,
      postal_code: v.postal_code || null,
      ciudad: v.ciudad || null,
      municipio: v.municipio || null,
      pais: v.pais || null,
      birth_date: v.birth_date ? (typeof v.birth_date === 'string' ? v.birth_date : v.birth_date?.toISOString?.()?.split('T')[0]) : null,
      birth_country: v.birth_country || null,
      nationality_country: v.nationality_country || null,
      issuing_authority: v.issuing_authority || null,
      incorporation_date: v.incorporation_date ? (typeof v.incorporation_date === 'string' ? v.incorporation_date : v.incorporation_date?.toISOString?.()?.split('T')[0]) : null,
      business_activity: v.business_activity || null
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
