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
          Bienvenido a la configuración inicial de NexFile
        </h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Este asistente te va a guiar para configurar una nueva instalación de NexFile.
          Vas a crear:
        </p>
        <ul style="line-height: 1.8;">
          <li>La <b>base de datos</b> y el esquema completo</li>
          <li>El <b>grupo de cliente</b> y sus razones sociales (companies) y agencias</li>
          <li>El <b>catálogo de procesos</b> y cuál de ellos lleva comprobante de pago</li>
          <li>Los <b>catálogos base</b> (tipos de documento, motivos de rechazo, métodos de pago, etc.)</li>
          <li>El <b>usuario administrador</b> con su contraseña</li>
          <li>El <b>branding</b> y la <b>configuración de integraciones</b> (Backblaze, APIs externas)</li>
        </ul>
        <p style="margin-top: 24px;">
          Necesitas acceso a un servidor MySQL accesible desde esta máquina.
          Al finalizar, apuntas el archivo <code>.env</code> del backend a la base de datos creada y listo.
        </p>
        <div class="wiz-step-actions">
          <span></span>
          <a mat-flat-button color="primary" routerLink="/db-connection">
            Empezar
            <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </a>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class WelcomeComponent {}
