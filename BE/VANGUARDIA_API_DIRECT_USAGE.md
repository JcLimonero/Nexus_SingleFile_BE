# API de Upload de Archivos - Vanguardia

## Uso Directo del API de Vanguardia

Ya no se usa un API local como puente. El frontend debe llamar **directamente** al API de Vanguardia.

### Endpoint Directo

```
POST https://apisvanguardia.com:400/backblaze/upload
```

### Headers Requeridos

```
Content-Type: multipart/form-data
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | File | ✅ | Archivo a subir |
| `idSingleFile` | Integer | ✅ | ID del archivo en tabla (IdFile) |
| `idDocumentFile` | Integer | ✅ | ID del documento (fileDocumentId) |

### Extensiones Permitidas

- `jpg`
- `jpeg` 
- `png`
- `pdf`
- `doc`
- `docx`
- `txt`

### Tamaño Máximo

- **100MB** por archivo

### Ejemplo de Uso (JavaScript/Angular)

```typescript
uploadFile(file: File, idSingleFile: number, fileDocumentId: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('idSingleFile', idSingleFile.toString());
  formData.append('idDocumentFile', fileDocumentId.toString());

  return this.http.post('https://apisvanguardia.com:400/backblaze/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
```

### Ejemplo de Uso (cURL)

```bash
curl -X POST "https://apisvanguardia.com:400/backblaze/upload" \
  -F "file=@documento.pdf" \
  -F "idSingleFile=13835" \
  -F "idDocumentFile=212341"
```

### Respuesta Exitosa

```json
{
  "status": 200,
  "message": "Archivo subido y registrado correctamente",
  "data": {
    "unique_name": "20250921_094425_8b57b77ef1_documento.pdf",
    "original_name": "documento.pdf",
    "database_updated": true
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Respuesta de Error

```json
{
  "status": 400,
  "message": "Error en la validación",
  "error": "Descripción del error"
}
```

## Configuración en el Frontend

### Angular Environment

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  vanguardiaApiUrl: 'https://apisvanguardia.com:400'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  vanguardiaApiUrl: 'https://apisvanguardia.com:400'
};
```

### Servicio Angular

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = environment.vanguardiaApiUrl;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, idSingleFile: number, fileDocumentId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idSingleFile', idSingleFile.toString());
    formData.append('idDocumentFile', fileDocumentId.toString());

    return this.http.post(`${this.apiUrl}/backblaze/upload`, formData);
  }
}
```

## Ventajas del Uso Directo

1. **Menos latencia** - Sin intermediario local
2. **Menos complejidad** - No hay que mantener código de puente
3. **Mejor rendimiento** - Conexión directa al servicio
4. **Menos puntos de falla** - Un solo servicio involucrado
5. **Actualizaciones automáticas** - Beneficias de mejoras del API de Vanguardia

## Notas Importantes

- El API de Vanguardia maneja toda la validación y subida
- No se requiere autenticación adicional en el API de Vanguardia
- El API de Vanguardia actualiza automáticamente la base de datos
- Se recomienda implementar manejo de errores robusto en el frontend
- Para archivos grandes, considerar mostrar progreso de upload
