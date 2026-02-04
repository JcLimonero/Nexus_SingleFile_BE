import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-selection-dialog',
  standalone: true,
  templateUrl: './client-selection-dialog.component.html',
  styleUrls: ['./client-selection-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ]
})
export class ClientSelectionDialogComponent {
  displayedColumns: string[] = ['ndCliente', 'cliente', 'rfc', 'email'];

  constructor(
    public dialogRef: MatDialogRef<ClientSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clients: any[] }
  ) {}

  selectClient(client: any): void {
    this.dialogRef.close(client);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
