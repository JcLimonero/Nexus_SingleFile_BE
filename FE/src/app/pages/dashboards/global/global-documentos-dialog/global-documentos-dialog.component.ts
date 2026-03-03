import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Subject, of, takeUntil } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Cliente, Documento, ValidacionService } from '../../../mesa-control/validacion/validacion.service';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { environment } from '../../../../../environments/environment';

export interface GlobalDocumentosDialogData {
  cliente: Cliente;
}

@Component({
  selector: 'app-global-documentos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './global-documentos-dialog.component.html',
  styleUrls: ['./global-documentos-dialog.component.scss']
})
export class GlobalDocumentosDialogComponent implements OnInit, OnDestroy {
  documentos: Documento[] = [];
  documentosDisplayedColumns: string[] = [
    'documento',
    'disponibleCliente',
    'estatus',
    'ver',
    'cargar',
    'requerido',
    'requiereExpiracion',
    'fecha',
    'fechaExpiracion',
    'comentario',
    'asignado'
  ];
  loading = true;
  error: string | null = null;
  selectedFiles: Record<string, File> = {};
  documentosPendientes = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private validacionService: ValidacionService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private apiConfig: ApiConfigService,
    private dialogRef: MatDialogRef<GlobalDocumentosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GlobalDocumentosDialogData
  ) {}

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrar(): void {
    this.dialogRef.close({ documentosNoAprobados: this.documentosPendientes });
  }

  cargarDocumentos(mostrarLoading: boolean = true): void {
    if (!this.data?.cliente) {
      this.error = 'No se recibió información del pedido.';
      this.loading = false;
      return;
    }

    if (mostrarLoading) {
      this.loading = true;
      this.error = null;
    }

    this.validacionService
      .cargarDocumentos(this.data.cliente.idFile)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {
          this.error = 'Error al cargar los documentos.';
          this.loading = false;
          this.documentos = [];
          return of({ documentos: [], idDocumentTypeLiquidacion: null, expedientAmount: 0, totalReceiptAmount: 0 });
        })
      )
      .subscribe((res) => {
        this.documentos = Array.isArray(res?.documentos) ? res.documentos : [];
        this.actualizarPendientes();
        this.loading = false;
      });
  }

  actualizarPendientes(): void {
    this.documentosPendientes = this.documentos.filter(
      (doc) => Number(doc.idEstatus) !== 4 && Number(doc.idEstatus) !== 0
    ).length;
  }

  /**
   * Sanitizar nombre de archivo: remover caracteres especiales como comas, acentos, etc.
   */
  private sanitizeFileName(file: File): File {
    // Obtener nombre original
    let fileName = file.name;
    
    // Remover caracteres especiales: comas, comillas, paréntesis, corchetes, etc.
    fileName = fileName.replace(/[,'"()[\]{}]/g, '');
    
    // Reemplazar espacios múltiples con un solo espacio
    fileName = fileName.replace(/\s+/g, ' ');
    
    // Remover acentos y caracteres diacríticos
    fileName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Trim de espacios al inicio y final
    fileName = fileName.trim();
    
    // Si el nombre quedó vacío, usar un nombre por defecto
    if (!fileName) {
      fileName = 'documento';
    }
    
    // Si el nombre cambió, crear un nuevo Blob con el nombre sanitizado
    if (fileName !== file.name) {
      return new File([file], fileName, { type: file.type });
    }
    
    return file;
  }

  isDocumentoStatus(documento: Documento, status: number): boolean {
    return Number(documento?.idEstatus) === status;
  }

  onFileSelected(event: Event, documento: Documento): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    const clave = this.obtenerClaveDocumento(documento);
    if (!clave) {
      this.snackBar.open('No se pudo identificar el documento.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.selectedFiles[clave] = file;
  }

  /** Solo permite carga cuando el documento está en: Nuevo (1), Cargado (2), Rechazado (5) o Caducado (6). No permite si está Aprobado (4) o En revisión (3). */
  puedeSubirDocumentos(documento: Documento): boolean {
    const status = Number(documento.idEstatus);
    return status === 1 || status === 2 || status === 5 || status === 6;
  }

  canUpload(documento: Documento): boolean {
    if (!this.puedeSubirDocumentos(documento)) return false;
    const clave = this.obtenerClaveDocumento(documento);
    const tieneArchivo = clave ? !!this.selectedFiles[clave] : false;
    return !!tieneArchivo;
  }

  uploadDocument(documento: Documento): void {
    const clave = this.obtenerClaveDocumento(documento);
    if (!clave) {
      this.snackBar.open('No se pudo identificar el documento', 'Cerrar', { duration: 3000 });
      return;
    }

    let file = this.selectedFiles[clave];
    if (!file) {
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', { duration: 3000 });
      return;
    }

    // Sanitizar nombre del archivo
    file = this.sanitizeFileName(file);

    const formData = new FormData();
    formData.append('file', file); // Archivo con nombre sanitizado
    formData.append('idSingleFile', this.data.cliente.idFile.toString());
    formData.append('idDocumentFile', clave);

    this.http
      .post<any>(this.apiConfig.getUploadApiUrl(), formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(`Documento ${documento.documento} cargado correctamente`, 'Cerrar', {
            duration: 3000
          });
          delete this.selectedFiles[clave];
          this.cargarDocumentos(false);
        },
        error: (error) => {

          this.snackBar.open('Error al subir el documento', 'Cerrar', { duration: 4000 });
        }
      });
  }

  onVerDocumento(documento: Documento): void {
    if (!documento.documentContainer) {
      this.snackBar.open('No se puede visualizar el documento. No hay archivo asociado.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (String(documento.idEstatus) === '2') {
      if (documento.idDocumentByFile === undefined || documento.idDocumentByFile === null) {
        this.snackBar.open('No se pudo preparar el documento, identificador inválido.', 'Cerrar', {
          duration: 3000
        });
        this.abrirDocumento(documento.documentContainer);
        return;
      }

      this.validacionService
        .prepararDocumento(documento.idDocumentByFile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            documento.idEstatus = 3;
            this.abrirDocumento(documento.documentContainer!);
            this.cargarDocumentos(false);
          },
          error: () => {
            this.snackBar.open(
              'No se pudo actualizar el estatus, pero se intentará abrir el documento.',
              'Cerrar',
              { duration: 3000 }
            );
            this.abrirDocumento(documento.documentContainer!);
          }
        });
    } else {
      this.abrirDocumento(documento.documentContainer);
    }
  }

  private abrirDocumento(documentContainer: string): void {
    const params = new URLSearchParams();
    if (documentContainer) {
      params.append('file', documentContainer);
    }
    params.append('duration', '3600');
    params.append('baseUrl', environment.apiBaseUrl);

    const url = `${this.apiConfig.getUploadApiBaseUrl()}/get-private-url?${params.toString()}`;

    this.http
      .get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const privateUrl = response?.data?.url;
          if (privateUrl) {
            const newWindow = window.open(privateUrl, '_blank');
            if (!newWindow) {
              this.snackBar.open('No se pudo abrir el documento en una nueva pestaña.', 'Cerrar', {
                duration: 4000
              });
            }
          } else {
            this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {

          this.snackBar.open('Error al obtener la URL del documento', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private obtenerClaveDocumento(documento: Documento): string | null {
    if (documento?.idDocumentByFile !== undefined && documento.idDocumentByFile !== null) {
      return documento.idDocumentByFile.toString();
    }
    return null;
  }
}

