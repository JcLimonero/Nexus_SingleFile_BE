// Entry point para los specs de Karma. Requerido por @angular-devkit/build-angular
// karma builder: lee este file primero, luego carga todos los *.spec.ts según el
// `include` de tsconfig.spec.json.

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Inicializar el entorno de testing de Angular antes de cargar los specs.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } }
);
