# 🚀 Deploy NexFile API - Puerto 402

## 📋 Instrucciones de Deploy

### 1. Preparación del Servidor
```bash
# Descomprimir el archivo ZIP
unzip NexFile-backend-deploy.zip

# Entrar al directorio
cd NexFile-api/
```

### 2. Configuración para Puerto 402
```bash
# Copiar configuración específica para puerto 402
cp env.port402 .env

# Dar permisos de ejecución al script
chmod +x start-port402.sh
```

### 3. Instalación de Dependencias
```bash
# Instalar dependencias de Composer
composer install --no-dev --optimize-autoloader

# Configurar permisos
chmod -R 755 writable/
```

### 4. Iniciar el Servidor
```bash
# Opción 1: Usar el script automático
./start-port402.sh

# Opción 2: Comando manual
php spark serve --host=0.0.0.0 --port=402
```

## 🌐 Acceso a la Aplicación

- **Frontend:** http://localhost:402/index.html
- **API:** http://localhost:402/api/
- **Documentación:** http://localhost:402/

## 📁 Archivos Importantes

- `env.port402` - Configuración específica para puerto 402
- `start-port402.sh` - Script de inicio automático
- `public/index.html` - Frontend Angular desplegado
- `public/` - Directorio web público

## 🔧 Configuración de Base de Datos

Edita el archivo `.env` y configura:
```env
database.default.hostname = localhost
database.default.database = tu_base_de_datos
database.default.username = tu_usuario
database.default.password = tu_password
```

## 🛡️ Seguridad

Para producción, cambia:
```env
encryption.key = tu_clave_de_encriptacion_segura_aqui
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que PHP esté instalado
2. Verifica que el puerto 402 esté disponible
3. Revisa los permisos del directorio `writable/`
4. Consulta los logs en `writable/logs/`
