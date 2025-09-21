# Frontend - Upload Directo a Vanguardia API

## Implementación Completada

Se ha actualizado el componente de integración (`integracion.component.ts`) para usar **directamente el API de Vanguardia** sin intermediarios locales.

### Cambios Realizados

#### 1. **Environment Configuration** (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorders',
    uploadApiUrl: 'https://apisvanguardia.com:400/backblaze/upload'
  }
};
```

#### 2. **Upload Method** (`uploadDocument`)
- ✅ **Eliminado**: Uso del API local como puente
- ✅ **Implementado**: Llamada directa al API de Vanguardia
- ✅ **Parámetros**: `file`, `idSingleFile`, `fileDocumentId`
- ✅ **Headers**: `Content-Type: multipart/form-data`

```typescript
uploadDocument(document: any): void {
  // Preparar datos para Vanguardia API
  const formData = new FormData();
  formData.append('file', this.selectedFiles[document.documentId]);
  formData.append('idSingleFile', this.selectedFile.fileId.toString());
  formData.append('idDocumentFile', document.fileDocumentId.toString());

  // Usar API de Vanguardia directamente
  this.http.post<any>(environment.vanguardia.uploadApiUrl, formData)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        // Manejo de respuesta exitosa
        this.snackBar.open(`Documento ${document.documentName} cargado exitosamente`, 'Cerrar');
        this.loadRequiredDocuments(this.selectedFile.fileId);
        delete this.selectedFiles[document.documentId];
      },
      error: (error) => {
        // Manejo de errores detallado
        this.snackBar.open(`Error subiendo documento: ${errorMessage}`, 'Cerrar');
      }
    });
}
```

#### 3. **View Document Method** (`getBackblazePrivateUrl`)
- ✅ **Actualizado**: Para usar el API de Vanguardia directamente
- ✅ **URL**: `https://apisvanguardia.com:400/backblaze/get-private-url`

```typescript
private getBackblazePrivateUrl(fileName: string, document: any): void {
  const url = `${environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;
  
  this.http.get<any>(url)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      }
    });
}
```

#### 4. **Métodos Eliminados**
- ❌ `saveDocumentInfo()` - Ya no necesario, Vanguardia maneja todo
- ❌ `getBackblazeHeaders()` - Reemplazado por `getVanguardiaHeaders()`

### Funcionalidades del Componente

#### **Upload de Documentos**
1. **Selección de archivo**: Click en "Seleccionar archivo"
2. **Validación**: Extensiones permitidas (jpg, jpeg, png, pdf, doc, docx, txt)
3. **Upload**: Click en "CARGAR" → Llamada directa a Vanguardia API
4. **Feedback**: Mensaje de éxito/error
5. **Actualización**: Recarga automática de documentos

#### **Visualización de Documentos**
1. **Ver documento**: Click en "VER"
2. **URL privada**: Generada por Vanguardia API
3. **Apertura**: Nueva pestaña del navegador

### Flujo de Trabajo

```
1. Usuario selecciona cliente
2. Sistema carga pedidos del cliente
3. Usuario selecciona pedido
4. Sistema carga documentos requeridos
5. Usuario selecciona archivo
6. Usuario hace click en "CARGAR"
7. Frontend → Vanguardia API (directo)
8. Vanguardia procesa y actualiza BD
9. Frontend recarga documentos
10. Usuario ve estado actualizado
```

### Ventajas de la Implementación

- ✅ **Menos latencia** - Sin intermediario local
- ✅ **Menos complejidad** - No hay código de puente que mantener
- ✅ **Mejor rendimiento** - Conexión directa al servicio
- ✅ **Menos puntos de falla** - Un solo servicio involucrado
- ✅ **Actualizaciones automáticas** - Beneficias de mejoras del API
- ✅ **Manejo centralizado** - Vanguardia maneja toda la lógica

### Manejo de Errores

El componente incluye manejo detallado de errores:

- **CORS**: Error de conexión
- **400**: Solicitud inválida
- **401**: Token inválido
- **403**: Acceso denegado
- **404**: Endpoint no encontrado
- **500**: Error interno del servidor

### Testing

Para probar la funcionalidad:

1. **Iniciar servidor frontend**: `ng serve --port 3600`
2. **Navegar a**: Integración de expediente
3. **Seleccionar**: Cliente y pedido
4. **Subir**: Documento usando el botón "CARGAR"
5. **Verificar**: Que el documento se carga correctamente
6. **Visualizar**: Usando el botón "VER"

### Configuración de Producción

Para producción, actualizar `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://tu-servidor.com',
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorders',
    uploadApiUrl: 'https://apisvanguardia.com:400/backblaze/upload'
  }
};
```

## Estado Actual

✅ **Implementación completada** - El componente de integración ahora usa directamente el API de Vanguardia para upload de archivos.

✅ **Sin intermediarios** - No hay API local como puente.

✅ **Funcionalidad completa** - Upload y visualización de documentos.

✅ **Manejo de errores** - Implementado para todos los casos.

✅ **Listo para testing** - La funcionalidad está lista para ser probada.
