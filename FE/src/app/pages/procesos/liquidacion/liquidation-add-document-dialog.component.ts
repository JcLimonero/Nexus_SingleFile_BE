import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-liquidation-add-document-dialog',
  standalone: true,
  templateUrl: './liquidation-add-document-dialog.component.html',
  styleUrls: ['./liquidation-add-document-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule
  ]
})
export class LiquidationAddDocumentDialogComponent implements OnInit {
  monto: number | null = null;
  idPaymentMethod: number | null = null;
  paymentMethods: { id: number; name: string }[] = [];
  expedientAmount = 0;
  totalReceiptAmount = 0;
  remainingAmount = 0;
  submitting = false;
  montoError = '';
  formTouched = false;

  get puedeConfirmar(): boolean {
    return this.isFormValid();
  }

  constructor(
    public dialogRef: MatDialogRef<LiquidationAddDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      fileId: number | string;
      expedientAmount?: number;
      totalReceiptAmount?: number;
      remainingAmount?: number;
    },
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.expedientAmount = this.data.expedientAmount ?? 0;
    this.totalReceiptAmount = this.data.totalReceiptAmount ?? 0;
    this.remainingAmount = this.data.remainingAmount ?? Math.max(0, this.expedientAmount - this.totalReceiptAmount);
    this.loadPaymentMethods();
  }

  private loadPaymentMethods(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/api/payment-method`)
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data?.paymentMethods) {
            this.paymentMethods = res.data.paymentMethods;
          }
        },
        error: () => {
          this.paymentMethods = [];
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

  onMontoChange(): void {
    this.validateMonto();
  }

  validateMonto(): boolean {
    this.montoError = '';
    if (this.monto == null || this.monto === undefined || this.monto <= 0) {
      this.montoError = 'El monto debe ser mayor a cero';
      return false;
    }
    if (this.monto > this.remainingAmount) {
      this.montoError = `El monto no puede superar lo disponible (${this.formatCurrency(this.remainingAmount)})`;
      return false;
    }
    return true;
  }

  isFormValid(): boolean {
    return (this.monto != null && this.monto > 0) &&
           (this.idPaymentMethod != null && this.idPaymentMethod > 0) &&
           this.monto <= this.remainingAmount;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.formTouched = true;
    if (!this.validateMonto() || !this.idPaymentMethod) return;
    this.submitting = true;

    this.http.post<any>(`${environment.apiBaseUrl}/api/clients-validation/documentos/liquidacion`, {
      idFile: this.data.fileId,
      monto: this.monto,
      id_payment_method: this.idPaymentMethod
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res?.success) {
          this.dialogRef.close({ success: true, data: res.data });
        } else {
          this.dialogRef.close({ success: false, message: res?.message || 'Error al agregar' });
        }
      },
      error: (err) => {
        this.submitting = false;
        this.dialogRef.close({
          success: false,
          message: err?.error?.message || 'Error de conexión al agregar el documento'
        });
      }
    });
  }
}
