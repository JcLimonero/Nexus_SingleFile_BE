# 🚀 SingleFile - Configuración del Entorno de Desarrollo

## 📋 Requisitos Previos

- **Node.js** (versión 18 o superior)
- **Angular CLI** (`npm install -g @angular/cli`)
- **PHP** (versión 8.0 o superior)
- **Composer** (para dependencias de PHP)

## 🔧 Configuración de Puertos

### Frontend (Angular)
- **Puerto:** 3600
- **URL:** http://localhost:3600

### Backend (CodeIgniter)
- **Puerto:** 8080
- **URL:** http://localhost:8080

### Configuración de APIs
- **Sistema:** Sin proxy - URLs directas configuradas en environment.ts
- **URL Base:** `http://localhost:8080` (configurable en environment.ts)
- **Ejemplo:** `http://localhost:8080/api/agency`

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

#### En macOS/Linux:
```bash
cd FE
./start-dev.sh
```

#### En Windows:
```cmd
cd FE
start-dev.bat
```

### Opción 2: Manual

#### 1. Iniciar Backend:
```bash
cd BE/singlefile-api
php spark serve --host=0.0.0.0 --port=8080
```

#### 2. Iniciar Frontend:
```bash
cd FE
npm start
# o
ng serve --port 3600
```

## ⚙️ Configuración de Entorno

### Archivos de Configuración:
- **`src/environments/environment.ts`** - Configuración de desarrollo
- **`src/environments/environment.prod.ts`** - Configuración de producción
- **`src/environments/environment.example.ts`** - Archivo de ejemplo

### Variables de Entorno:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080' // URL del backend
};
```

## 🔄 Sistema de APIs

### Servicio Base (ApiBaseService):
- **Ubicación:** `src/app/core/services/api-base.service.ts`
- **Funcionalidad:** Construye URLs completas para las APIs
- **Métodos:**
  - `buildApiUrl(endpoint)` - Construye URL para endpoints de API
  - `buildAuthUrl(endpoint)` - Construye URL para autenticación
  - `buildWsUrl(endpoint)` - Construye URL para WebSocket

### Uso en Servicios:
```typescript
constructor(
  private http: HttpClient,
  private apiBaseService: ApiBaseService
) {}

getAgencies(): Observable<AgencyResponse> {
  return this.http.get<AgencyResponse>(
    this.apiBaseService.buildApiUrl('agency')
  );
}
```

## 🚫 Eliminación del Proxy

**IMPORTANTE:** Se eliminó la configuración del proxy de Angular para evitar problemas de conectividad.

### Cambios Realizados:
1. **Eliminado:** `proxyConfig` del `angular.json`
2. **Eliminado:** `proxy.conf.json`
3. **Implementado:** Sistema de URLs directas con environment.ts
4. **Actualizado:** Todos los servicios para usar el nuevo sistema

## 🔍 Verificación de Funcionamiento

### 1. Verificar Backend:
```bash
curl http://localhost:8080/api/agency
```

### 2. Verificar Frontend:
- Abrir http://localhost:3600
- Verificar que las llamadas a la API funcionen
- Revisar la consola del navegador para errores

### 3. Verificar Comunicación:
- El frontend debe poder hacer llamadas a `http://localhost:8080/api/*`
- No debe haber errores de CORS
- Las respuestas de la API deben ser correctas

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED"
- **Causa:** Backend no está corriendo en el puerto 8080
- **Solución:** Verificar que el backend esté activo

### Error: "CORS"
- **Causa:** Backend no permite requests del frontend
- **Solución:** Verificar configuración CORS en el backend

### Error: "API not found"
- **Causa:** URL incorrecta o endpoint inexistente
- **Solución:** Verificar la configuración en environment.ts

## 📝 Notas Importantes

- **Puerto 3600:** Frontend siempre debe correr en este puerto
- **Puerto 8080:** Backend debe correr en este puerto
- **Sin Proxy:** Todas las llamadas son directas al backend
- **Environment:** Cambiar apiBaseUrl según el entorno de desarrollo
