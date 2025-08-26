# Guía de Implementación: Imágenes de Perfil de Usuario

## Descripción
Esta implementación permite a los usuarios subir, ver y eliminar imágenes de perfil que se almacenan en la base de datos en formato base64.

## Archivos Implementados

### Backend (CodeIgniter)

#### 1. Script SQL - `BE/singlefile-api/scripts/add_profile_image_fields.sql`
- Agrega campos `profile_image`, `image_type`, e `image_size` a la tabla `Users`
- Incluye comentarios descriptivos y índices para optimización

#### 2. Modelo Actualizado - `BE/singlefile-api/app/Models/UserModel.php`
- Nuevos campos en `$allowedFields`
- Métodos para manejar imágenes:
  - `updateProfileImage()` - Actualizar imagen
  - `removeProfileImage()` - Eliminar imagen
  - `getProfileImage()` - Obtener imagen
  - `hasProfileImage()` - Verificar si tiene imagen

#### 3. Controlador - `BE/singlefile-api/app/Controllers/UserProfileImageController.php`
- `uploadProfileImage()` - Subir nueva imagen
- `getProfileImage()` - Obtener imagen completa
- `getProfileImageInfo()` - Obtener información sin imagen
- `removeProfileImage()` - Eliminar imagen
- Validaciones de tipo, tamaño y dimensiones

#### 4. Rutas - `BE/singlefile-api/app/Config/Routes.php`
- Grupo `user/profile-image` con endpoints para todas las operaciones

### Frontend (Angular)

#### 5. Servicio - `FE/src/app/core/services/user-profile-image.service.ts`
- Métodos para todas las operaciones de imagen
- Validación de archivos
- Compresión de imágenes
- Conversión base64 a URL

#### 6. Interfaz Actualizada - `FE/src/app/core/services/auth.service.ts`
- Campo `image_size` agregado a la interfaz `User`

#### 7. Componente Actualizado - `FE/src/app/pages/apps/social/social-profile/social-profile.component.ts`
- Funcionalidad para subir, eliminar y mostrar imágenes
- Integración con el servicio de imágenes

#### 8. Template Actualizado - `FE/src/app/pages/apps/social/social-profile/social-profile.component.html`
- Input de archivo para subir imágenes
- Vista previa de la imagen actual
- Botón para eliminar imagen
- Información del tamaño de archivo

## Instalación y Configuración

### Paso 1: Base de Datos
```sql
-- Ejecutar el script SQL
source BE/singlefile-api/scripts/add_profile_image_fields.sql
```

### Paso 2: Backend
1. Los archivos del modelo y controlador ya están creados
2. Las rutas ya están configuradas
3. Reiniciar el servidor de CodeIgniter

### Paso 3: Frontend
1. Los servicios y componentes ya están implementados
2. Compilar el proyecto Angular: `ng build`

## Funcionalidades Implementadas

### ✅ Subir Imagen de Perfil
- Validación de tipo de archivo (JPEG, PNG, GIF, WEBP)
- Validación de tamaño (máximo 5MB)
- Validación de dimensiones (máximo 2048x2048)
- Compresión automática antes de subir
- Conversión a base64 para almacenamiento

### ✅ Ver Imagen de Perfil
- Vista previa circular en el perfil
- Avatar por defecto si no hay imagen
- Información del tamaño de archivo

### ✅ Eliminar Imagen de Perfil
- Botón de eliminación con confirmación
- Limpieza de campos en la base de datos

### ✅ Validaciones de Seguridad
- Solo usuarios autenticados pueden modificar su imagen
- Validación de tipos de archivo permitidos
- Límites de tamaño y dimensiones
- Sanitización de archivos

## Endpoints de la API

### POST `/api/user/profile-image/upload`
- Subir nueva imagen de perfil
- Body: FormData con archivo `profile_image`

### GET `/api/user/profile-image/get`
- Obtener imagen del usuario autenticado

### GET `/api/user/profile-image/get/{userId}`
- Obtener imagen de un usuario específico

### GET `/api/user/profile-image/info`
- Obtener información de la imagen (sin la imagen completa)

### GET `/api/user/profile-image/info/{userId}`
- Obtener información de imagen de un usuario específico

### DELETE `/api/user/profile-image/remove`
- Eliminar imagen del usuario autenticado

## Estructura de Datos

### Tabla Users (campos agregados)
```sql
profile_image LONGTEXT NULL    -- Imagen en base64
image_type VARCHAR(50) NULL    -- Tipo MIME (ej: image/jpeg)
image_size INT NULL            -- Tamaño en bytes
```

### Respuestas de la API
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {
    "image_type": "image/jpeg",
    "image_size": 102400,
    "dimensions": {
      "width": 800,
      "height": 600
    }
  }
}
```

## Consideraciones de Rendimiento

### Base64 vs Archivos en Disco
- **Base64**: Simple de implementar, pero aumenta el tamaño de la BD
- **Recomendación**: Para producción, considerar almacenamiento en disco o CDN

### Compresión de Imágenes
- Compresión automática a 800x800 píxeles máximo
- Calidad del 80% para balance entre tamaño y calidad
- Reducción significativa del tamaño de archivo

### Índices de Base de Datos
- Índice creado en `profile_image` para consultas eficientes
- Solo se indexan registros con imagen (WHERE profile_image IS NOT NULL)

## Próximos Pasos Recomendados

### 1. Implementar Almacenamiento en Disco
- Crear directorio `uploads/profile-images/`
- Almacenar archivos físicos en lugar de base64
- Mantener solo la ruta en la base de datos

### 2. Agregar CDN
- Integrar con servicios como AWS S3 o Cloudinary
- URLs públicas para las imágenes
- Mejor rendimiento y escalabilidad

### 3. Cache de Imágenes
- Implementar cache en el frontend
- Cache en el backend para respuestas frecuentes
- Headers de cache apropiados

### 4. Validación Avanzada
- Detección de contenido malicioso
- Análisis de metadatos EXIF
- Filtros de contenido inapropiado

## Solución de Problemas

### Error: "Cannot find module"
- Verificar que todos los archivos estén en las ubicaciones correctas
- Comprobar que las importaciones usen rutas relativas correctas

### Error: "Module not found"
- Ejecutar `npm install` para instalar dependencias
- Verificar que Angular Material esté instalado

### Error de Base de Datos
- Verificar que el script SQL se ejecutó correctamente
- Comprobar permisos de la base de datos
- Verificar que los campos existan en la tabla

### Imagen no se muestra
- Verificar que la imagen se guardó correctamente en la BD
- Comprobar que el tipo MIME sea correcto
- Verificar la conversión base64 a URL

## Soporte y Mantenimiento

### Logs
- Todos los errores se registran en los logs de CodeIgniter
- Verificar `writable/logs/` para debugging

### Monitoreo
- Monitorear el tamaño de la base de datos
- Verificar el rendimiento de las consultas
- Revisar el uso de memoria en el frontend

### Actualizaciones
- Mantener las dependencias actualizadas
- Revisar regularmente las mejores prácticas de seguridad
- Actualizar las validaciones según sea necesario
