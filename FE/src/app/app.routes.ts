import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LoginGuard } from './core/guards/login.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const appRoutes: VexRoutes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [LoginGuard]
  },
  // register y forgot-password redirigen a login: ambos componentes no llaman API
  // (sólo router.navigate(['/'])). Si se reactivan en el futuro, restaurar las rutas.
  { path: 'register', redirectTo: 'login', pathMatch: 'full' },
  { path: 'forgot-password', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'consulta/:token',
    loadComponent: () =>
      import('./pages/miniportal/consulta/consulta.component').then(
        (m) => m.ConsultaMiniportalComponent
      )
  },
  {
    path: 'coming-soon',
    loadComponent: () =>
      import('./pages/pages/coming-soon/coming-soon.component').then(
        (m) => m.ComingSoonComponent
      )
  },
  {
    path: 'cuenta-suspendida',
    loadComponent: () =>
      import('./pages/cuenta-suspendida/cuenta-suspendida.component').then(
        (m) => m.CuentaSuspendidaComponent
      )
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      {
        path: 'dashboards/analytics',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: 'dashboards/global',
        loadComponent: () =>
          import('./pages/dashboards/global/global.component').then(
            (m) => m.GlobalComponent
          )
      },
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/dashboards/dashboard-analytics/dashboard-analytics.component'
          ).then((m) => m.DashboardAnalyticsComponent)
      },
      // Rutas Vex template demo (apps/*, ui/*, documentation, pages/pricing|faq|guides|invoice)
      // removidas — eran de la plantilla original y no se usan en este proyecto.
      // Conservamos pages/error-404 y pages/error-500 porque el router los referencia.
      {
        path: 'pages',
        children: [
          {
            path: 'error-404',
            loadComponent: () =>
              import('./pages/pages/errors/error-404/error-404.component').then(
                (m) => m.Error404Component
              )
          },
          {
            path: 'error-500',
            loadComponent: () =>
              import('./pages/pages/errors/error-500/error-500.component').then(
                (m) => m.Error500Component
              )
          }
        ]
      },
      {
        path: 'configuracion',
        children: [
          {
            path: 'general',
            loadComponent: () =>
              import('./pages/configuracion/configuracion-general/configuracion-general.component').then(
                (m) => m.ConfiguracionGeneralComponent
              )
          },
          {
            path: 'documentos-requeridos',
            loadComponent: () =>
              import('./pages/configuracion/documentos-requeridos/documentos-requeridos.component').then(
                (m) => m.DocumentosRequeridosComponent
              )
          },
          {
            path: 'usuarios',
            loadComponent: () =>
              import('./pages/configuracion/usuarios/usuarios.component').then(
                (m) => m.UsuariosComponent
              )
          },
          {
            path: 'logs-activity',
            loadComponent: () =>
              import('./pages/configuracion/logs-activity/logs-activity.component').then(
                (m) => m.LogsActivityComponent
              )
          },
          {
            path: 'motivos-rechazo',
            loadComponent: () =>
              import('./pages/configuracion/motivos-rechazo/motivos-rechazo.component').then(
                (m) => m.MotivosRechazoComponent
              )
          },
          {
            path: 'motivos-extraordinarios',
            loadComponent: () =>
              import('./pages/configuracion/motivos-extraordinarios/motivos-extraordinarios.component').then(
                (m) => m.MotivosExtraordinariosComponent
              )
          }
        ]
      },
              {
          path: 'configuracion/catalogos',
          children: [
            {
              path: 'agencias',
              loadComponent: () =>
                import('./pages/configuracion/catalogos/agencias/agencias.component').then(
                  (m) => m.AgenciasComponent
                )
            },
            {
              path: 'procesos',
              loadComponent: () =>
                import('./pages/configuracion/catalogos/procesos/procesos.component').then(
                  (m) => m.ProcesosComponent
                )
            },
            {
              path: 'tipos-operacion',
              loadComponent: () =>
                import('./pages/configuracion/catalogos/tipos-operacion/tipos-operacion.component').then(
                  (m) => m.TiposOperacionComponent
                )
            },
            {
              path: 'tipos-cliente',
              loadComponent: () =>
                import('./pages/configuracion/tipos-cliente/tipos-cliente.component').then(
                  (m) => m.TiposClienteComponent
                )
            },
            {
              path: 'tipos-documento',
              loadComponent: () =>
                import('./pages/configuracion/tipos-documento/tipos-documento.component').then(
                  (m) => m.TiposDocumentoComponent
                )
            }
                  ]
      },
      {
        path: 'procesos',
        children: [
          {
            path: 'integracion',
            loadComponent: () =>
              import('./pages/procesos/integracion/integracion.component').then(
                (m) => m.IntegracionComponent
              )
          },
          {
            path: 'liquidacion',
            loadComponent: () =>
              import('./pages/procesos/liquidacion/liquidacion.component').then(
                (m) => m.LiquidacionComponent
              )
          },
          {
            path: 'liberacion',
            loadComponent: () =>
              import('./pages/procesos/liberacion/liberacion.component').then(
                (m) => m.LiberacionComponent
              )
          }
        ]
      },
      {
        path: 'mesa-control',
        children: [
          {
            path: 'validacion',
            loadComponent: () =>
              import('./pages/mesa-control/validacion/validacion.component').then(
                (m) => m.ValidacionComponent
              )
          },
          {
            path: 'consolidacion-dms',
            loadComponent: () =>
              import('./pages/mesa-control/consolidacion-dms/consolidacion-dms.component').then(
                (m) => m.ConsolidacionDmsComponent
              )
          },
          {
            path: 'clientes',
            loadComponent: () =>
              import('./pages/mesa-control/clientes/clientes.component').then(
                (m) => m.ClientesComponent
              )
          },
          {
            path: 'reportes-cumplimiento',
            loadComponent: () =>
              import('./pages/mesa-control/reportes-cumplimiento/reportes-cumplimiento.component').then(
                (m) => m.ReportesCumplimientoComponent
              )
          },
          {
            path: 'expedientes-corregir',
            loadComponent: () =>
              import('./pages/mesa-control/expedientes-corregir/expedientes-corregir.component').then(
                (m) => m.ExpedientesCorregirComponent
              )
          }
        ]
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/pages/errors/error-404/error-404.component').then(
            (m) => m.Error404Component
          )
      }
    ]
  }
];
