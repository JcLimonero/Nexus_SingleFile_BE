import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../../../../../environments/environment';

export interface DocumentosNoConfiguradosData {
  fileId: string;
  pedidoLabel?: string;
}

export interface DocNoConfigurado {
  documentId: number;
  documentName: string;
  isRequired: number | boolean;
  hasExpiration?: number | boolean;
  processTypeName?: string;
  subProcessName?: string | null;
}

@Component({
  selector: 'app-documentos-no-configurados-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './documentos-no-configurados-dialog.component.html',
  styleUrls: ['./documentos-no-configurados-dialog.component.scss']
})
export class DocumentosNoConfiguradosDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  loading = true;
  adding = false;
  documents: DocNoConfigurado[] = [];
  dataSource = new MatTableDataSource<DocNoConfigurado>([]);
  displayedColumns: string[] = ['select', 'documentName', 'subProcessName', 'isRequired'];
  selectedDocumentIds = new Set<number>();
  error: string | null = null;
  pageSizeOptions = [5, 10, 25];
  defaultPageSize = 10;

  constructor(
    public dialogRef: MatDialogRef<DocumentosNoConfiguradosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentosNoConfiguradosData,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this.loading = true;
    this.error = null;
    const params = new HttpParams().set('fileId', this.data.fileId);
    this.http.get<{ success: boolean; data?: { documents: any[] }; message?: string }>(
      `${environment.apiBaseUrl}/api/documents/missing-liberation`,
      { params }
    ).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data?.documents) {
          this.documents = res.data.documents;
          this.dataSource.data = this.documents;
          setTimeout(() => { if (this.paginator) this.dataSource.paginator = this.paginator; });
        } else {
          this.documents = [];
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.loading = false;
        this.documents = [];
        this.dataSource.data = [];
        this.error = err?.error?.message || 'Error al cargar los documentos no configurados';
      }
    });
  }

  isSelected(doc: DocNoConfigurado): boolean {
    return this.selectedDocumentIds.has(doc.documentId);
  }

  toggleSelection(doc: DocNoConfigurado): void {
    if (this.selectedDocumentIds.has(doc.documentId)) {
      this.selectedDocumentIds.delete(doc.documentId);
    } else {
      this.selectedDocumentIds.add(doc.documentId);
    }
    this.selectedDocumentIds = new Set(this.selectedDocumentIds);
  }

  private getCurrentPageData(): DocNoConfigurado[] {
    const d = this.dataSource.data;
    const p = this.dataSource.paginator;
    if (!p) return d;
    const start = p.pageIndex * p.pageSize;
    return d.slice(start, start + p.pageSize);
  }

  isAllOnPageSelected(): boolean {
    const pageData = this.getCurrentPageData();
    return pageData.length > 0 && pageData.every(d => this.selectedDocumentIds.has(d.documentId));
  }

  toggleAllOnPage(): void {
    const pageData = this.getCurrentPageData();
    if (this.isAllOnPageSelected()) {
      pageData.forEach(d => this.selectedDocumentIds.delete(d.documentId));
    } else {
      pageData.forEach(d => this.selectedDocumentIds.add(d.documentId));
    }
    this.selectedDocumentIds = new Set(this.selectedDocumentIds);
  }

  get selectedCount(): number {
    return this.selectedDocumentIds.size;
  }

  addToExpediente(): void {
    if (this.selectedDocumentIds.size === 0) return;
    this.adding = true;
    const body = {
      fileId: Number(this.data.fileId),
      documentTypeIds: Array.from(this.selectedDocumentIds)
    };
    this.http.post<{ success: boolean; message?: string; data?: { added: number } }>(
      `${environment.apiBaseUrl}/api/documents/add-to-file`,
      body
    ).subscribe({
      next: (res) => {
        this.adding = false;
        if (res.success) {
          this.snackBar.open(res.message ?? 'Documentos agregados al expediente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ added: true, count: res.data?.added ?? this.selectedDocumentIds.size });
        } else {
          this.snackBar.open(res.message ?? 'Error al agregar documentos', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        this.adding = false;
        const msg = err?.error?.message ?? 'Error al agregar documentos al expediente';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
