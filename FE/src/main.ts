import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => {

  // Ocultar splash screen si existe
  const splashScreen = document.getElementById('vex-splash-screen');
  if (splashScreen) {
    splashScreen.style.display = 'none';
  }
  
  // Mostrar mensaje de error visible
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #111827;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 999999;
  `;
  errorDiv.innerHTML = `
    <h1 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Error al cargar la aplicación</h1>
    <p style="margin-bottom: 0.5rem;">Por favor, abre la consola del navegador (F12) para ver más detalles.</p>
    <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 1rem;">
      Error: ${err?.message || 'Error desconocido'}
    </p>
    <button onclick="location.reload()" style="
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
    ">Reintentar</button>
  `;
  document.body.appendChild(errorDiv);
});
