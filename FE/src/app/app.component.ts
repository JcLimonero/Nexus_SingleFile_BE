import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigLoaderService } from './core/services/config-loader.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(private configLoader: ConfigLoaderService) {}

  ngOnInit(): void {
    // Cargar configuración externa al inicializar la aplicación con recarga forzada
    this.configLoader.forceReloadConfig().subscribe({
      next: (config) => {
        console.log('✅ Configuración cargada exitosamente:', config);
        console.log('✅ URL base de API:', config.api.baseUrl);
      },
      error: (error) => {
        console.warn('⚠️ Error al cargar configuración:', error);
      }
    });
  }
}
