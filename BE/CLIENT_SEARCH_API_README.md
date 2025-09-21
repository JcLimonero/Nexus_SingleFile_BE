# API de Búsqueda de Clientes con Vista

## Descripción
Este API utiliza la vista `view_client` para realizar búsquedas eficientes de clientes, evitando los JOINs complejos del controlador original.

## Endpoints Disponibles

### 1. Búsqueda de Clientes
**GET** `/api/client-search/search`

#### Parámetros:
- `idAgency` (requerido): ID de la agencia (corresponde a Agency.Id, que es el mismo valor que File.IdAgency en la vista)
- `search` (opcional): Término de búsqueda
- `limit` (opcional): Límite de resultados (default: 50)

#### Ejemplo:
```
GET /api/client-search/search?idAgency=1&search=38&limit=10
```

**Nota importante**: 
- El parámetro `idAgency` debe ser el `Id` de la tabla `Agency` (1, 2, 3...)
- Este valor corresponde a `File.IdAgency` que se usa en la vista `view_client`
- NO usar `Agency.IdAgency` (10017, 10082...) que es un identificador diferente

#### Respuesta:
```json
{
  "success": true,
  "message": "Clientes obtenidos exitosamente",
  "data": {
    "clientes": [
      {
        "idCliente": 38,
        "ndCliente": "38",
        "cliente": "Juan Pérez García",
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García",
        "rfc": "PEGJ123456789",
        "email": "juan.perez@email.com",
        "telefono": "5551234567",
        "telefono2": "5557654321",
        "razonSocial": "Juan Pérez García",
        "curp": "PEGJ123456HDFRRN01",
        "asesor": "María López",
        "agenciaOrigen": "Geely",
        "fechaRegistro": "2024-01-15",
        "fechaActualizacion": "2024-01-20"
      }
    ],
    "total": 1
  }
}
```

### 2. Obtener Cliente por ID
**GET** `/api/client-search/{id}`

#### Parámetros:
- `id` (requerido): ID del cliente
- `idAgency` (requerido): ID de la agencia

#### Ejemplo:
```
GET /api/client-search/38?idAgency=1
```

### 3. Obtener Clientes por Agencia
**GET** `/api/client-search/by-agency/{idAgency}`

#### Parámetros:
- `idAgency` (requerido): ID de la agencia
- `limit` (opcional): Límite de resultados (default: 100)
- `offset` (opcional): Offset para paginación (default: 0)

#### Ejemplo:
```
GET /api/client-search/by-agency/1?limit=20&offset=0
```

## Características de Búsqueda

### Filtro por Agencia
- **Siempre requerido**: Todos los endpoints requieren el parámetro `idAgency`
- **Filtro automático**: Se aplica automáticamente `WHERE idAgency = ?`

### Búsqueda Numérica
Cuando el término de búsqueda es numérico, el API busca en:
- `ndCliente` (número de cliente) - **Campo principal para números**

### Búsqueda de Texto
Cuando el término de búsqueda es texto, el API busca en:
- `razonSocial` (razón social/nombre) - **Campo principal para texto**

### Columnas de la Vista `view_client`
**Columnas Originales de la Vista:**
- `Id`: ID interno del cliente
- `ndClient`: Número de cliente (para búsquedas numéricas)
- `Name`: Nombre del cliente
- `LastName`: Apellido paterno
- `MotherLastName`: Apellido materno
- `RFC`: RFC del cliente
- `Email`: Email del cliente
- `TelNumber`: Teléfono principal
- `TelNumber2`: Teléfono secundario
- `RazonSocial`: Razón social (para búsquedas de texto)
- `CURP`: CURP del cliente
- `Adviser`: Asesor asignado
- `AgencyOrigin`: Agencia de origen
- `RegistrationDate`: Fecha de registro
- `UpdateDate`: Fecha de actualización
- `idAgency`: ID de la agencia (filtro obligatorio)

**Columnas Devueltas por el API (con alias):**
- `idCliente`: ID interno del cliente
- `ndCliente`: Número de cliente
- `cliente`: Nombre completo concatenado
- `nombre`: Nombre del cliente
- `apellidoPaterno`: Apellido paterno
- `apellidoMaterno`: Apellido materno
- `rfc`: RFC del cliente
- `email`: Email del cliente
- `telefono`: Teléfono principal
- `telefono2`: Teléfono secundario
- `razonSocial`: Razón social
- `curp`: CURP del cliente
- `asesor`: Asesor asignado
- `agenciaOrigen`: Agencia de origen
- `fechaRegistro`: Fecha de registro
- `fechaActualizacion`: Fecha de actualización
- `idAgency`: ID de la agencia

## Ventajas sobre el API Original

1. **Más Eficiente**: Usa la vista `view_client` optimizada
2. **Búsqueda por ID Directo**: Encuentra clientes por su ID interno
3. **Mejor Rendimiento**: Evita JOINs complejos en tiempo de ejecución
4. **Logging de Debug**: Incluye logs para facilitar el debugging
5. **Tipado Fuerte**: Interfaces TypeScript para el frontend

## Uso en el Frontend

### Servicio Angular
```typescript
import { ClientSearchService } from './core/services/client-search.service';

// Inyectar el servicio
constructor(private clientSearchService: ClientSearchService) {}

// Buscar clientes
this.clientSearchService.searchClients(1, '38', 50)
  .subscribe(response => {
    console.log('Clientes encontrados:', response.data.clientes);
  });
```

### Métodos Disponibles
- `searchClients(idAgency, searchTerm, limit)`
- `getClientById(id)`
- `getClientsByAgency(idAgency, limit, offset)`
- `searchByClientNumber(idAgency, clientNumber)`
- `searchByName(idAgency, name)`

## Logs de Debug

El API incluye logging automático que se puede ver en los logs del servidor:
- Consulta SQL generada
- Parámetros enviados
- Número de resultados encontrados

## Migración desde el API Original

El nuevo API reemplaza las llamadas a:
- `/api/client/search` → `/api/client-search/search`

El frontend ya ha sido actualizado para usar el nuevo servicio `ClientSearchService`.
