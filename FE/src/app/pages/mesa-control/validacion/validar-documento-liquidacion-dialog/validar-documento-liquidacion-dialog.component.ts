import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

registerLocaleData(localeEsMx, 'es-MX');

class CustomDateAdapter extends NativeDateAdapter {
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  }
  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    }
    return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  }
}

export interface ValidarDocumentoLiquidacionData {
  documento: any;
  idFile: number;
}

export interface ValidarDocumentoLiquidacionResult {
  aprobado: boolean;
  estatus: string;
  comentario?: string;
  fechaExpiracion?: Date;
  monto?: number;
  idPaymentMethod?: number;
}

@Component({
  selector: 'app-validar-documento-liquidacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ],
  templateUrl: './validar-documento-liquidacion-dialog.component.html',
  styleUrls: ['./validar-documento-liquidacion-dialog.component.scss']
})
export class ValidarDocumentoLiquidacionDialogComponent implements OnInit {
  estatusSeleccionado = '';
  comentario = '';
  fechaExpiracion: Date | null = null;
  monto: number | null = null;
  idPaymentMethod: number | null = null;
  montoError = '';
  paymentMethods: { id: number; name: string }[] = [];
  expedientAmount = 0;
  totalReceiptAmount = 0;
  remainingAmount = 0;
  loadingAmounts = true;

  opcionesEstatus = [
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ValidarDocumentoLiquidacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ValidarDocumentoLiquidacionData,
    private http: HttpClient
  ) {}

  /** Si el documento ya tiene monto y método de pago cargados (solo validar) */
  get tieneDatosCargados(): boolean {
    const amt = this.getReceiptAmount();
    const pm = this.data.documento?.idPaymentMethod ?? this.data.documento?.id_payment_method;
    return (amt != null && amt > 0) && (pm != null && pm > 0);
  }

  private getReceiptAmount(): number | null {
    const v = this.data.documento?.receiptAmount ?? this.data.documento?.receiptamount;
    if (v == null || v === '') return null;
    return typeof v === 'number' ? v : parseFloat(String(v));
  }

  ngOnInit(): void {
    if (this.tieneDatosCargados) {
      this.monto = this.getReceiptAmount();
      this.idPaymentMethod = Number(this.data.documento?.idPaymentMethod ?? this.data.documento?.id_payment_method ?? 0);
    }
    this.loadPaymentMethods();
    this.loadExpedientAmounts();
  }

  private loadPaymentMethods(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/api/payment-method`).subscribe({
      next: (res) => {
        if (res?.success && res?.data?.paymentMethods) {
          this.paymentMethods = res.data.paymentMethods;
        }
      },
      error: () => { this.paymentMethods = []; }
    });
  }

  private loadExpedientAmounts(): void {
    this.loadingAmounts = true;
    this.http.get<any>(`${environment.apiBaseUrl}/api/documents/required`, {
      params: { fileId: this.data.idFile, idProcessType: '2' }
    }).subscribe({
      next: (res) => {
        this.loadingAmounts = false;
        if (res?.success && res?.data) {
          this.expedientAmount = res.data.expedientAmount ?? 0;
          this.totalReceiptAmount = res.data.totalReceiptAmount ?? 0;
          this.remainingAmount = res.data.remainingAmount ?? Math.max(0, this.expedientAmount - this.totalReceiptAmount);
        }
      },
      error: () => {
        this.loadingAmounts = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  get requiereExpiracion(): boolean {
    return this.data.documento.ReqExpiration == 1 || this.data.documento.ReqExpiration === '1';
  }

  onMontoChange(): void {
    this.validateMonto();
  }

  validateMonto(): boolean {
    this.montoError = '';
    if (this.estatusSeleccionado !== 'aprobado') return true;
    const m = this.monto ?? this.getReceiptAmount() ?? 0;
    if (m <= 0) {
      this.montoError = 'El monto debe ser mayor a cero';
      return false;
    }
    // Solo validar contra remainingAmount cuando el usuario ingresa datos nuevos
    if (!this.tieneDatosCargados && m > this.remainingAmount) {
      this.montoError = `El monto no puede superar lo disponible (${this.formatCurrency(this.remainingAmount)})`;
      return false;
    }
    return true;
  }

  get puedeConfirmar(): boolean {
    if (!this.estatusSeleccionado) return false;
    if (this.estatusSeleccionado === 'rechazado') {
      return this.comentario.trim() !== '';
    }
    if (this.estatusSeleccionado === 'aprobado') {
      if (this.requiereExpiracion && !this.fechaExpiracion) return false;
      const m = this.monto ?? this.getReceiptAmount() ?? 0;
      if (m <= 0) return false;
      if (!this.tieneDatosCargados && !this.idPaymentMethod) return false;
      // Solo validar contra remainingAmount cuando el usuario ingresa datos nuevos (no cuando ya vienen cargados)
      if (!this.tieneDatosCargados && m > this.remainingAmount) return false;
    }
    return true;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onConfirmar(): void {
    if (!this.estatusSeleccionado) return;
    if (this.estatusSeleccionado === 'rechazado' && !this.comentario.trim()) return;
    if (this.estatusSeleccionado === 'aprobado') {
      if (!this.validateMonto()) return;
      if (!this.tieneDatosCargados && !this.idPaymentMethod) return;
    }

    const montoFinal = this.estatusSeleccionado === 'aprobado' ? (this.monto ?? this.getReceiptAmount() ?? undefined) : undefined;
    const pmVal = this.idPaymentMethod ?? Number(this.data.documento?.idPaymentMethod ?? this.data.documento?.id_payment_method ?? 0);
    const idPaymentMethodFinal = this.estatusSeleccionado === 'aprobado' && pmVal > 0 ? pmVal : undefined;

    const result: ValidarDocumentoLiquidacionResult = {
      aprobado: this.estatusSeleccionado === 'aprobado',
      estatus: this.estatusSeleccionado,
      comentario: this.comentario.trim() || undefined,
      fechaExpiracion: this.fechaExpiracion || undefined,
      monto: montoFinal,
      idPaymentMethod: idPaymentMethodFinal
    };
    this.dialogRef.close(result);
  }
}
