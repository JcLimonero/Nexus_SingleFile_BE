# 🔐 Implementación de Encriptado de Contraseñas

Este documento describe la implementación del sistema de encriptado de contraseñas para la tabla `User` en SingleFile API.

## 📋 Cambios Implementados

### 1. Migraciones de Base de Datos

#### `UpdateUserPasswordField.php`
- Cambia el campo `Pass` de `VARCHAR(50)` a `VARCHAR(255)` para soportar hash bcrypt
- Agrega campo `password_migrated` para tracking de migración

#### `MigrateExistingPasswords.php`
- Encripta automáticamente las contraseñas existentes en texto plano
- Marca las contraseñas como migradas

### 2. Modelos Actualizados

#### `UserModel.php`
- Callbacks automáticos para hashear contraseñas antes de insertar/actualizar
- Métodos para verificar, cambiar y gestionar contraseñas
- Soporte para migración de contraseñas existentes

#### `AuthModel.php`
- Compatibilidad con contraseñas en texto plano durante la migración
- Actualización automática a hash cuando se detecta texto plano

### 3. Nuevo Controlador

#### `PasswordManager.php`
- **POST** `/api/password/change` - Cambiar contraseña de usuario
- **POST** `/api/password/reset` - Reset de contraseña por administrador
- **GET** `/api/password/migration-status` - Estado de migración
- **POST** `/api/password/force-migration` - Forzar migración específica

### 4. Script de Migración

#### `scripts/migrate_passwords.php`
- Script de línea de comandos para migrar contraseñas existentes
- Proceso automático con reporte de resultados

## 🚀 Pasos para Implementar

### Paso 1: Ejecutar Migraciones de Base de Datos

```bash
cd BE/singlefile-api
php spark migrate
```

### Paso 2: Migrar Contraseñas Existentes

```bash
php scripts/migrate_passwords.php
```

### Paso 3: Verificar Implementación

```bash
# Verificar estado de migración
curl -X GET http://localhost:8000/api/password/migration-status

# Probar login con usuario existente
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"contraseña"}'
```

## 🔒 Características de Seguridad

### Algoritmo de Hash
- **bcrypt** con `PASSWORD_DEFAULT`
- Salt automático y único por contraseña
- Costo de computación configurable

### Validaciones
- Longitud mínima de 8 caracteres
- Verificación de contraseña actual antes de cambiar
- Confirmación de nueva contraseña

### Migración Segura
- Compatibilidad con contraseñas existentes durante la transición
- Actualización automática a hash en el primer login
- Tracking de estado de migración

## 📊 Endpoints de la API

### Autenticación
```
POST /api/auth/login          - Login de usuario
POST /api/auth/verify         - Verificar token JWT
POST /api/auth/refresh        - Renovar token JWT
POST /api/auth/logout         - Logout de usuario
```

### Gestión de Contraseñas
```
POST /api/password/change     - Cambiar contraseña
POST /api/password/reset      - Reset por administrador
GET  /api/password/migration-status - Estado de migración
POST /api/password/force-migration - Forzar migración
```

## 🧪 Pruebas

### 1. Login con Usuario Existente
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@singlefile.com",
    "password": "admin123"
  }'
```

### 2. Cambiar Contraseña
```bash
curl -X POST http://localhost:8000/api/password/change \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "user_id": 1,
    "current_password": "admin123",
    "new_password": "nuevaContraseña123",
    "confirm_password": "nuevaContraseña123"
  }'
```

### 3. Verificar Estado de Migración
```bash
curl -X GET http://localhost:8000/api/password/migration-status
```

## ⚠️ Consideraciones Importantes

### Seguridad
- Las contraseñas nunca se almacenan en texto plano
- El hash bcrypt es resistente a ataques de fuerza bruta
- Las contraseñas existentes se migran automáticamente

### Compatibilidad
- El sistema funciona con contraseñas en texto plano durante la migración
- Después de la migración, solo se aceptan hashes
- Los usuarios existentes pueden seguir usando sus contraseñas

### Mantenimiento
- Revisar logs de migración para verificar el proceso
- Monitorear el campo `password_migrated` para usuarios pendientes
- Considerar rotación periódica de contraseñas

## 🐛 Solución de Problemas

### Error: "Campo password_migrated no existe"
```bash
# Ejecutar migraciones primero
php spark migrate
```

### Error: "No se pueden migrar contraseñas"
```bash
# Verificar permisos de base de datos
# Ejecutar script manualmente
php scripts/migrate_passwords.php
```

### Usuarios no pueden hacer login
- Verificar que las contraseñas se hayan migrado correctamente
- Revisar logs de la aplicación
- Usar endpoint de estado de migración para diagnóstico

## 📝 Notas de Desarrollo

- El sistema es compatible con CodeIgniter 4
- Utiliza las funciones nativas de PHP para hash de contraseñas
- Implementa callbacks automáticos para transparencia del desarrollador
- Soporta migración gradual sin interrumpir el servicio

## 🔄 Próximos Pasos Recomendados

1. **Implementar políticas de contraseñas** (complejidad, expiración)
2. **Agregar autenticación de dos factores** (2FA)
3. **Implementar auditoría de cambios de contraseña**
4. **Configurar notificaciones por email** para cambios de contraseña
5. **Implementar bloqueo de cuenta** después de intentos fallidos

---

**Fecha de Implementación:** Enero 2025  
**Versión:** 1.0  
**Desarrollador:** SingleFile Team
