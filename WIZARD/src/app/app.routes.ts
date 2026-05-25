import { Routes } from '@angular/router';

/**
 * Each route is one step of the wizard. Loaded lazily so the initial bundle stays small
 * and individual steps can be edited without churning the rest.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent)
  },
  {
    path: 'db-connection',
    loadComponent: () =>
      import('./pages/db-connection/db-connection.component').then((m) => m.DbConnectionComponent)
  },
  {
    path: 'schema',
    loadComponent: () => import('./pages/schema/schema.component').then((m) => m.SchemaComponent)
  },
  // Pasos 4-13 — placeholders por ahora, se completan en commits siguientes
  {
    path: 'placeholder/:slug',
    loadComponent: () =>
      import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent)
  },
  { path: '**', redirectTo: 'welcome' }
];
