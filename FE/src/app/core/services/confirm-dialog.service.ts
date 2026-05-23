import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmVariant
} from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * Reemplaza `window.confirm()` con un dialog Material reutilizable que respeta
 * el branding y la accesibilidad. Devuelve Observable<boolean> (también hay
 * `confirmAsync()` para await directo en async/await).
 *
 *   constructor(private confirm: ConfirmDialogService) {}
 *
 *   this.confirm.confirm({
 *     title: 'Eliminar usuario',
 *     message: `¿Eliminar el usuario "${name}"?`,
 *     variant: 'danger',
 *     confirmText: 'Eliminar'
 *   }).subscribe(ok => { if (ok) this.delete(); });
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data,
        width: 'auto',
        autoFocus: false,
        disableClose: true
      }
    ).afterClosed() as Observable<boolean>;
  }

  /** Versión async/await para reemplazos directos de `if (confirm(...))`. */
  async confirmAsync(data: ConfirmDialogData): Promise<boolean> {
    const result = await firstValueFrom(this.confirm(data));
    return !!result;
  }

  /** Atajos por variante para call-sites menos verbosos. */
  confirmDelete(message: string, title = 'Eliminar', details?: string): Observable<boolean> {
    return this.confirm({
      title,
      message,
      details,
      variant: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });
  }

  confirmAction(message: string, title = 'Confirmar acción', variant: ConfirmVariant = 'warning'): Observable<boolean> {
    return this.confirm({ title, message, variant, confirmText: 'Continuar', cancelText: 'Cancelar' });
  }
}
