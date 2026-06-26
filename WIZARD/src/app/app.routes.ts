import { Routes } from '@angular/router';

/**
 * Each route is one step of the wizard. Loaded lazily so the initial bundle stays small
 * and individual steps can be edited without churning the rest.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
    path: 'central-db',
    loadComponent: () =>
      import('./pages/central-db/central-db.component').then((m) => m.CentralDbComponent),
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'tenant-info',
    loadComponent: () =>
      import('./pages/tenant-info/tenant-info.component').then((m) => m.TenantInfoComponent),
  },
  // /schema removed in opt-D — Step 14 (Confirmar) does all DB work atomically
  // with auto-rollback on failure. The route stays redirected for muscle memory.
  { path: 'schema', redirectTo: 'client-group' },
  {
    path: 'client-group',
    loadComponent: () =>
      import('./pages/client-group/client-group.component').then((m) => m.ClientGroupComponent),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./pages/companies/companies.component').then((m) => m.CompaniesComponent),
  },
  {
    path: 'agencies',
    loadComponent: () =>
      import('./pages/agencies/agencies.component').then((m) => m.AgenciesComponent),
  },
  {
    path: 'phases',
    loadComponent: () =>
      import('./pages/processes/processes.component').then((m) => m.ProcessesComponent),
  },
  // Alias legacy — antes el paso se llamaba "processes" pero ahora maneja
  // fases (expedient_state) + subfases (expedient_sub_state).
  { path: 'processes', redirectTo: 'phases', pathMatch: 'full' },
  {
    path: 'catalogs',
    loadComponent: () =>
      import('./pages/catalogs/catalogs.component').then((m) => m.CatalogsComponent),
  },
  {
    path: 'admin-user',
    loadComponent: () =>
      import('./pages/admin-user/admin-user.component').then((m) => m.AdminUserComponent),
  },
  {
    path: 'branding',
    loadComponent: () =>
      import('./pages/branding/branding.component').then((m) => m.BrandingComponent),
  },
  {
    path: 'integrations',
    loadComponent: () =>
      import('./pages/integrations/integrations.component').then((m) => m.IntegrationsComponent),
  },
  {
    path: 'confirm',
    loadComponent: () =>
      import('./pages/confirm/confirm.component').then((m) => m.ConfirmComponent),
  },
  {
    path: 'done',
    loadComponent: () => import('./pages/done/done.component').then((m) => m.DoneComponent),
  },
  // legacy placeholder route — keeps any old links working during transition
  {
    path: 'placeholder/:slug',
    loadComponent: () =>
      import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
  },

  // ===== Modo Administración (tenants ya deployados) =====
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-home.component').then((m) => m.AdminHomeComponent),
  },
  {
    path: 'admin/tenants',
    loadComponent: () =>
      import('./pages/admin/tenants/tenants-list.component').then((m) => m.TenantsListComponent),
  },
  {
    path: 'admin/tenants/:id',
    loadComponent: () =>
      import('./pages/admin/tenants/edit/tenant-edit-shell.component').then((m) => m.TenantEditShellComponent),
  },

  { path: '**', redirectTo: 'welcome' },
];
