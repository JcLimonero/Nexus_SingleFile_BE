import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withInterceptors
} from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatNativeDateModule } from '@angular/material/core';
import { provideIcons } from './core/icons/icons.provider';
import { provideLuxon } from './core/luxon/luxon.provider';
import { provideVex } from '@vex/vex.provider';
import { provideNavigation } from './core/navigation/navigation.provider';
import { vexConfigs } from '@vex/config/vex-configs';
import { provideQuillConfig } from 'ngx-quill';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ActivityLogInterceptor } from './core/interceptors/activity-log.interceptor';
import { TimeoutRetryInterceptor } from './core/interceptors/timeout-retry.interceptor';
import { BrandingService } from './core/services/branding.service';
import { AppSplashScreenService } from './core/services/app-splash-screen.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (branding: BrandingService) => () => branding.load(),
      deps: [BrandingService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (splash: AppSplashScreenService) => () => {},
      deps: [AppSplashScreenService],
      multi: true
    },
    importProvidersFrom(
      BrowserModule,
      MatDialogModule,
      MatBottomSheetModule,
      MatNativeDateModule
    ),
    provideRouter(
      appRoutes,
      // TODO: Add preloading withPreloading(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([TimeoutRetryInterceptor, AuthInterceptor, ActivityLogInterceptor])
    ),
    {
      // Default global: previene que dialogs con muchos campos se corten en laptops 13" / DPI alto
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        maxHeight: '90vh',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
        restoreFocus: true
      } as MatDialogConfig
    },

    provideVex({
      config: vexConfigs.poseidon,
      availableThemes: [
        { name: 'Default', className: 'vex-theme-default' },
        { name: 'Teal', className: 'vex-theme-teal' },
        { name: 'Green', className: 'vex-theme-green' },
        { name: 'Purple', className: 'vex-theme-purple' },
        { name: 'Red', className: 'vex-theme-red' },
        { name: 'Orange', className: 'vex-theme-orange' }
      ]
    }),
    provideNavigation(),
    provideIcons(),
    provideLuxon(),
    provideQuillConfig({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['clean'],
          ['link', 'image']
        ]
      }
    })
  ]
};
