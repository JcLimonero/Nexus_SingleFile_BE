import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface RechazarDocumentoData {
  documento: any;
}

export interface RechazarDocumentoResult {
  rechazado: boolean;
  comentario: string;
}

@Component({
  selector: 'vex-rechazar-documento-dialog',
  templateUrl: './rechazar-documento-dialog.component.html',
  styleUrls: ['./rechazar-documento-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class RechazarDocumentoDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RechazarDocumentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RechazarDocumentoData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      comentario: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close({ rechazado: false, comentario: '' });
  }

  onConfirm(): void {
    if (this.form.valid) {
      this.dialogRef.close({ rechazado: true, comentario: this.form.value.comentario });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
