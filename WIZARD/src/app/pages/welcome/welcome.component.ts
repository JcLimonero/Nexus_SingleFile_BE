import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'wiz-welcome',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="wiz-card">
      <mat-card-content>
        <h1 style="display:flex; align-items:center; gap:12px;">
          <mat-icon style="font-size: 36px; height: 36px; width: 36px;">rocket_launch</mat-icon>
          Bienvenido al provisioning de NexFile
        </h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Este asistente registra un <b>nuevo tenant</b> en el SaaS y configura su
          base de datos completa.
        </p>
        <ol style="line-height: 1.8;">
          <li>Conectar a la <b>central DB</b> (registro de tenants)</li>
          <li>Login como <b>super-admin</b> para auditar quién provisiona</li>
          <li>Identificar el <b>tenant</b> (slug + nombre + credenciales de su DB)</li>
          <li>Crear la DB del tenant + aplicar esquema</li>
          <li>Capturar grupo de cliente, razones sociales, agencias</li>
          <li>Configurar procesos (orden + cuál lleva comprobantes)</li>
          <li>Editar catálogos base (a partir de defaults razonables)</li>
          <li>Crear el usuario admin del tenant</li>
          <li>Branding + integraciones (Backblaze, APIs externas)</li>
          <li>Confirmar y ejecutar</li>
        </ol>
        <p>Necesitas:</p>
        <ul style="line-height: 1.6;">
          <li>Credenciales MySQL para la central DB (<code>nexfile_central</code>)</li>
          <li>Credenciales MySQL para crear la DB del tenant (puede ser otro servidor)</li>
          <li>La clave de cifrado <code>TENANT_DB_ENCRYPTION_KEY</code> (compartida con BE/.env)</li>
          <li>Usuario super-admin existente (provisiónalo con <code>php spark super-admin:seed</code>)</li>
        </ul>
        <div class="wiz-step-actions">
          <span></span>
          <a mat-flat-button color="primary" routerLink="/central-db">
            Empezar
            <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </a>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class WelcomeComponent {}
