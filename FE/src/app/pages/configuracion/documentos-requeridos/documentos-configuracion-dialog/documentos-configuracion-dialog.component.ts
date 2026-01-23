import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentoRequerido } from '../../../../core/interfaces/documento-requerido.interface';

export interface DocumentosConfiguracionDialogData {
  configuracion: {
    IdProcess: string;
    IdAgency: string;
    IdCostumerType: string;
    IdOperationType: string;
    ProcesoName?: string;
    AgenciaName?: string;
    TipoClienteName?: string;
    TipoOperacionName?: string;
  };
  documentos: DocumentoRequerido[];
}

@Component({
  selector: 'app-documentos-configuracion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './documentos-configuracion-dialog.component.html',
  styleUrls: ['./documentos-configuracion-dialog.component.scss']
})
export class DocumentosConfiguracionDialogComponent implements OnInit {
  displayedColumns: string[] = ['tipoDocumento', 'etapa', 'subEtapa', 'requerido', 'requiereExpiracion', 'enabled'];
  dataSource: DocumentoRequerido[] = [];

  constructor(
    public dialogRef: MatDialogRef<DocumentosConfiguracionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentosConfiguracionDialogData
  ) {}

  ngOnInit(): void {
    this.dataSource = this.data.documentos || [];
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
