# Pruebas de API con Playwright

Este directorio contiene las pruebas automatizadas de la API usando Playwright.

## Estructura

```
tests/
├── api/                          # Pruebas de API
│   ├── auth/                     # Pruebas de autenticación
│   ├── crud/                     # Pruebas CRUD básicas
│   ├── analytics/                # Pruebas de analytics
│   ├── reports/                  # Pruebas de reportes
│   ├── files/                    # Pruebas de archivos
│   ├── documents/                # Pruebas de documentos
│   ├── process/                  # Pruebas de procesos
│   └── helpers/                  # Helpers y utilidades
│       ├── auth.ts               # Helper de autenticación
│       ├── api-client.ts        # Cliente API genérico
│       └── fixtures.ts           # Fixtures de Playwright
├── playwright.config.ts          # Configuración de Playwright
└── package.json                  # Dependencias
```

## Instalación

1. Instalar dependencias:

```bash
cd BE/tests
npm install
```

2. Instalar navegadores de Playwright:

```bash
npm run install:browsers
```

## Configuración

### Variables de Entorno

Crear un archivo `.env` en el directorio `tests/` (opcional):

```env
API_BASE_URL=http://localhost:8080
TEST_EMAIL=admin@nexusqtec.com
TEST_PASSWORD=admin123
```

O establecerlas al ejecutar:

```bash
API_BASE_URL=http://localhost:8080 npm test
```

### Credenciales de Prueba

Las credenciales por defecto se pueden configurar en:
- Variables de entorno: `TEST_EMAIL` y `TEST_PASSWORD`
- O modificar directamente en `api/helpers/fixtures.ts`

## Ejecución

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas específicas

```bash
# Solo autenticación
npm run test:auth

# Solo CRUD
npm run test:crud

# Solo analytics
npm run test:analytics

# Solo reportes
npm run test:reports

# Solo archivos
npm run test:files
```

### Modos de ejecución

```bash
# Modo UI interactivo
npm run test:ui

# Modo headed (con navegador visible)
npm run test:headed

# Modo debug
npm run test:debug
```

### Ver reporte HTML

```bash
npm run report
```

## Estructura de las Pruebas

### Ejemplo de prueba básica

```typescript
import { test, expect } from '../helpers/fixtures';

test('GET /api/agency - Listar agencias', async ({ apiClient, authTokens }) => {
  apiClient.setAuthToken(authTokens.accessToken);

  const response = await apiClient.get('agency');
  const body = await apiClient.expectSuccess(response);

  expect(Array.isArray(body.data)).toBe(true);
});
```

### Helpers disponibles

#### ApiClient

Cliente genérico para realizar peticiones HTTP:

```typescript
// GET
const response = await apiClient.get('endpoint', { params: { key: 'value' } });

// POST
const response = await apiClient.post('endpoint', { data: 'value' });

// PUT
const response = await apiClient.put('endpoint/:id', { data: 'value' });

// PATCH
const response = await apiClient.patch('endpoint/:id', { data: 'value' });

// DELETE
const response = await apiClient.delete('endpoint/:id');

// Verificar éxito
const body = await apiClient.expectSuccess(response);

// Verificar error
const body = await apiClient.expectError(response, 404);
```

#### AuthHelper

Helper para operaciones de autenticación:

```typescript
const tokens = await authHelper.login(email, password);
const isValid = await authHelper.verifyToken(token);
const newToken = await authHelper.refreshToken(refreshToken);
await authHelper.logout(accessToken);
```

#### Fixtures

Las fixtures proporcionan acceso automático a `apiClient`, `authHelper` y `authTokens`:

```typescript
test('Mi prueba', async ({ apiClient, authTokens }) => {
  // apiClient ya está configurado
  // authTokens ya contiene tokens válidos
  apiClient.setAuthToken(authTokens.accessToken);
  // ...
});
```

## Cobertura de Endpoints

### Autenticación ✅
- POST /api/auth/login
- POST /api/auth/verify
- POST /api/auth/refresh
- POST /api/auth/logout

### CRUD Básicos ✅
- Agency (GET, POST, PUT, DELETE, PATCH)
- User (GET, POST, PUT, DELETE, PATCH)
- Document Type (GET, POST, PUT, DELETE, PATCH)
- Process (GET, POST, PUT, DELETE, PATCH)

### Analytics ✅
- Dashboard
- Widgets de estadísticas
- Distribuciones
- Datos históricos

### Reportes ✅
- Dashboard de cumplimiento
- Expedientes con alerta PLD
- Resumen por agencia
- Documentos pendientes

### Archivos ✅
- Por cliente
- Por agencia/cliente
- Verificar pedidos existentes
- Reparar relaciones

### Documentos ✅
- Documentos requeridos
- Documentos faltantes
- Obtener nombre de archivo

## Agregar Nuevas Pruebas

1. Crear archivo en el directorio apropiado (ej: `api/new-feature/new-feature.spec.ts`)
2. Importar fixtures: `import { test, expect } from '../helpers/fixtures';`
3. Usar `apiClient` y `authTokens` de las fixtures
4. Seguir el patrón de las pruebas existentes

Ejemplo:

```typescript
import { test, expect } from '../helpers/fixtures';

test.describe('API New Feature', () => {
  test('GET /api/new-feature - Listar', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);
    const response = await apiClient.get('new-feature');
    const body = await apiClient.expectSuccess(response);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
```

## CI/CD

Para ejecutar en CI/CD, usar:

```bash
npm test -- --reporter=json --output=test-results/results.json
```

## Troubleshooting

### Error: Servidor no disponible

Asegúrate de que el servidor esté corriendo:

```bash
cd BE
php spark serve --port=8080
```

### Error: Credenciales inválidas

Verifica las credenciales en las variables de entorno o en `fixtures.ts`.

### Error: Timeout

Aumenta el timeout en `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 30000, // 30 segundos
}
```

## Notas

- Las pruebas crean datos de prueba que pueden persistir en la base de datos
- Algunas pruebas pueden fallar si no hay datos suficientes en la BD
- Ajusta los IDs y datos de prueba según tu entorno
- Las pruebas de DELETE pueden requerir limpieza manual si fallan
