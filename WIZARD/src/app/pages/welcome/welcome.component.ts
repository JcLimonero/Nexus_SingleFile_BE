import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Hero de bienvenida — lenguaje visual basado en nexusqtech.com:
 * navy + cyan, tipografía limpia, layout aireado, CTA sólido.
 */
@Component({
  selector: 'wiz-welcome',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="hero">
      <div class="hero-eyebrow">Socio tecnológico · Guadalajara, MX</div>
      <h1 class="hero-title">
        Provisionar un nuevo <span class="hero-accent">tenant</span> de NexFile
      </h1>
      <p class="hero-lead">
        Este asistente crea el registro en la central, genera la base de datos del
        cliente y siembra catálogos, branding e integraciones. Pensado para que el
        deploy de una nueva concesionaria sea reproducible y auditable.
      </p>
      <div class="hero-actions">
        <a mat-flat-button color="primary" routerLink="/central-db" class="cta-primary">
          Empezar provisioning
          <mat-icon iconPositionEnd>arrow_forward</mat-icon>
        </a>
        <a mat-stroked-button routerLink="/admin" class="cta-secondary">
          <mat-icon>tune</mat-icon>
          Editar tenant existente
        </a>
      </div>
    </div>

    <div class="cards-grid">
      <div class="info-card">
        <div class="info-card-icon">
          <mat-icon>storage</mat-icon>
        </div>
        <h3>Central + tenant DB</h3>
        <p>
          Registra el tenant en <code>nexfile_central</code> con credenciales
          cifradas (AES-256-GCM), crea su base y aplica el baseline.
        </p>
      </div>
      <div class="info-card">
        <div class="info-card-icon">
          <mat-icon>account_tree</mat-icon>
        </div>
        <h3>Jerarquía + catálogos</h3>
        <p>
          Captura grupo de cliente, razones sociales y agencias. Edita los
          catálogos base partiendo de los defaults razonables.
        </p>
      </div>
      <div class="info-card">
        <div class="info-card-icon">
          <mat-icon>verified_user</mat-icon>
        </div>
        <h3>Admin + integraciones</h3>
        <p>
          Crea el usuario administrador, configura branding y guarda las claves
          de Backblaze, Orders API y demás integraciones.
        </p>
      </div>
    </div>

    <div class="reqs">
      <h4>Antes de empezar necesitas</h4>
      <ul>
        <li>Credenciales MySQL para la central DB (<code>nexfile_central</code>)</li>
        <li>Credenciales MySQL para crear la DB del tenant (puede ser otro servidor)</li>
        <li><code>TENANT_DB_ENCRYPTION_KEY</code> de <code>config/central.env</code></li>
        <li>Super-admin existente (<code>php spark super-admin:seed</code>)</li>
      </ul>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .hero {
      padding: 40px 0 24px;
      max-width: 760px;
    }
    .hero-eyebrow {
      font-size: 12px;
      color: var(--nexus-cyan, #06b6d4);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
      margin-bottom: 14px;
    }
    .hero-title {
      font-size: 40px;
      line-height: 1.15;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--nexus-navy, #0a2540);
      margin: 0 0 16px;
    }
    .hero-accent {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-lead {
      font-size: 17px;
      line-height: 1.6;
      color: var(--nexus-text-muted, #4b5b73);
      max-width: 680px;
      margin: 0 0 28px;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .cta-primary {
      height: 44px !important;
      padding: 0 22px !important;
      font-size: 14px !important;
    }
    .cta-secondary {
      height: 44px !important;
      padding: 0 18px !important;
      font-size: 14px !important;
      color: var(--nexus-navy) !important;
      border-color: var(--nexus-gray-border, #e3e5ea) !important;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-top: 40px;
    }
    .info-card {
      background: #ffffff;
      border: 1px solid var(--nexus-gray-border, #e3e5ea);
      border-radius: 12px;
      padding: 20px;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }
    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(10, 37, 64, 0.06);
      border-color: var(--nexus-cyan, #06b6d4);
    }
    .info-card-icon {
      width: 38px; height: 38px;
      border-radius: 8px;
      background: var(--nexus-cyan-50, #ecfeff);
      color: var(--nexus-cyan-600, #0891b2);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
    }
    .info-card h3 {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 6px;
      color: var(--nexus-navy, #0a2540);
    }
    .info-card p {
      font-size: 13px;
      line-height: 1.55;
      color: var(--nexus-text-muted, #4b5b73);
      margin: 0;
    }

    .reqs {
      margin-top: 40px;
      padding: 20px;
      background: #ffffff;
      border-left: 3px solid var(--nexus-cyan, #06b6d4);
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(10, 37, 64, 0.04);
    }
    .reqs h4 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--nexus-text-muted, #4b5b73);
      margin: 0 0 10px;
      font-weight: 600;
    }
    .reqs ul {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 14px;
      line-height: 1.8;
      color: var(--nexus-navy, #0a2540);
    }
    .reqs li {
      padding-left: 18px;
      position: relative;
    }
    .reqs li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--nexus-cyan, #06b6d4);
      font-weight: 600;
    }
    .reqs code {
      background: var(--nexus-gray-bg, #f3f3f5);
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 12px;
      color: var(--nexus-navy, #0a2540);
    }
  `],
})
export class WelcomeComponent {}
