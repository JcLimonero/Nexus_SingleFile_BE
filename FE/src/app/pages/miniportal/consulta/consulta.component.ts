import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BrandingService } from '../../../core/services/branding.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import {
  MiniportalService,
  ExpedienteMiniportal,
  MiniportalExpedienteResponse,
  DocumentoMiniportal
} from '../../../core/services/miniportal.service';

@Component({
  selector: 'app-consulta-miniportal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaMiniportalComponent implements OnInit {
  token = '';
  loading = true;
  error = '';
  expediente: ExpedienteMiniportal | null = null;
  avisoAceptado = false;
  aceptando = false;
  aceptadoCheck = false;
  documentos: DocumentoMiniportal[] = [];
  loadingDocumentos = false;
  uploadingIds = new Set<number>();
  logoLogin$ = this.brandingService.getBranding$().pipe(map((b) => b.logoLogin));

  constructor(
    private route: ActivatedRoute,
    private miniportalService: MiniportalService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private brandingService: BrandingService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.error = 'Enlace inválido';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }
    this.token = token;
    this.cargarExpediente();
  }

  private cargarExpediente(): void {
    this.miniportalService.getExpediente(this.token).subscribe({
      next: (res: MiniportalExpedienteResponse) => {
        this.loading = false;
        if (res.success && res.data) {
          this.expediente = res.data.expediente;
          this.avisoAceptado = res.data.avisoAceptado;
          if (this.avisoAceptado) {
            this.cargarDocumentos();
          }
          this.cdr.markForCheck();
        } else {
          this.error = res.message || 'No se pudo cargar el expediente';
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || err.message || 'Enlace inválido o expirado';
        this.cdr.markForCheck();
      }
    });
  }

  aceptarAviso(): void {
    if (!this.aceptadoCheck || this.avisoAceptado || this.aceptando) return;
    this.aceptando = true;
    this.cdr.markForCheck();

    this.miniportalService.acceptAviso(this.token, {}).subscribe({
      next: (res) => {
        this.aceptando = false;
        if (res.success) {
          this.avisoAceptado = true;
          this.cargarDocumentos();
          this.cdr.markForCheck();
        } else {
          this.error = res.message || 'Error al aceptar';
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.aceptando = false;
        this.error = err.error?.message || err.message || 'Error al aceptar el aviso';
        this.cdr.markForCheck();
      }
    });
  }

  private cargarDocumentos(): void {
    if (!this.token) return;
    this.loadingDocumentos = true;
    this.cdr.markForCheck();
    this.miniportalService.getDocumentos(this.token).subscribe({
      next: (res) => {
        this.loadingDocumentos = false;
        if (res.success && res.data) {
          this.documentos = res.data;
        } else {
          this.documentos = [];
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingDocumentos = false;
        this.documentos = [];
        this.cdr.markForCheck();
      }
    });
  }

  verDocumento(doc: DocumentoMiniportal): void {
    if (!doc.documentContainer) return;
    this.miniportalService.getDocumentUrl(this.token, doc.documentContainer).subscribe({
      next: (res) => {
        const url = res.data?.url ?? (res as any).url;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    });
  }

  onFileSelected(doc: DocumentoMiniportal, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    input.value = '';
    this.subirDocumento(doc, file);
  }

  subirDocumento(doc: DocumentoMiniportal, file: File): void {
    this.uploadingIds.add(doc.idDocumentByFile);
    this.cdr.markForCheck();
    this.miniportalService.uploadDocument(this.token, doc.idDocumentByFile, file).subscribe({
      next: (res) => {
        this.uploadingIds.delete(doc.idDocumentByFile);
        this.snackBar.open(res.message || 'Documento subido correctamente', 'Cerrar', { duration: 3000 });
        this.cargarDocumentos();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.uploadingIds.delete(doc.idDocumentByFile);
        this.snackBar.open(err.error?.message || err.message || 'Error al subir', 'Cerrar', { duration: 5000 });
        this.cdr.markForCheck();
      }
    });
  }
}
