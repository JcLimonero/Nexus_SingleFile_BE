import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // withHashLocation: Electron loads file:// which breaks pushState routing — hash works everywhere
    provideRouter(routes, withHashLocation()),
    provideAnimations()
  ]
};
