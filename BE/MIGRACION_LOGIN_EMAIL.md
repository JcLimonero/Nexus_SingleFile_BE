# Migración Gradual de Login: Username → Email

## 📋 Descripción

Este documento describe la implementación de la migración gradual del sistema de autenticación, permitiendo que usuarios del sistema antiguo (que usan `User`/username) migren gradualmente al nuevo sistema (que usa `Mail`/email).

## 🔄 Flujo de Migración

### Escenario 1: Usuario con Email (Migrado)
1. Usuario intenta login con **email** → ✅ Login exitoso
2. Usuario intenta login con **username** → ✅ Login exitoso (si tiene email)

### Escenario 2: Usuario sin Email (Pendiente de Migración)
1. Usuario intenta login con **username** → ⚠️ Login exitoso pero requiere completar email
2. Sistema retorna `requires_email: true` con datos del usuario
3. Usuario completa su email mediante endpoint `/api/auth/update-email`
4. Después de actualizar, puede usar email o username para login

## 🔌 Endpoints de API

### POST `/api/auth/login`

**Soporta login por email o username**

**Request:**
```json
{
  "email": "usuario@ejemplo.com",  // O "username": "nombreusuario"
  "password": "contraseña123"
}
```

**Response - Login Exitoso:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "login_method": "email",  // o "username"
  "user": {
    "id": 1,
    "name": "Nombre Usuario",
    "email": "usuario@ejemplo.com",
    "username": "nombreusuario",
    "role_id": 1,
    "role_name": "Administrador",
    "enabled": 1
  },
  "access_token": "eyJ0eXAiOiJKV1Q...",
  "refresh_token": "eyJ0eXAiOiJKV1Q...",
  "expires_in": 3600
}
```

**Response - Requiere Email:**
```json
{
  "success": false,
  "requires_email": true,
  "message": "Para continuar, necesitas completar tu correo electrónico...",
  "user_id": 5,
  "username": "nombreusuario",
  "name": "Nombre Usuario"
}
```

**Response - Error:**
```json
{
  "success": false,
  "message": "Usuario no encontrado o deshabilitado"
}
```

### POST `/api/auth/update-email`

**Actualizar email de usuario durante la migración**

**Request:**
```json
{
  "user_id": 5,
  "email": "nuevo@email.com",
  "password": "contraseña123"
}
```

**Response - Éxito:**
```json
{
  "success": true,
  "message": "Email actualizado exitosamente. Ahora puedes iniciar sesión con tu correo electrónico."
}
```

**Response - Error:**
```json
{
  "success": false,
  "message": "Contraseña incorrecta. No se puede actualizar el email sin verificar la contraseña."
}
```

## 💻 Implementación en Frontend

### Ejemplo de Manejo del Login

```typescript
async login(identifier: string, password: string) {
  try {
    const response = await this.http.post(`${this.apiUrl}/auth/login`, {
      email: identifier,  // Puede ser email o username
      password: password
    }).toPromise();

    if (response.success) {
      // Login exitoso
      this.storeTokens(response.access_token, response.refresh_token);
      this.router.navigate(['/dashboard']);
    } else if (response.requires_email) {
      // Requiere completar email
      this.showEmailUpdateModal({
        userId: response.user_id,
        username: response.username,
        name: response.name
      });
    } else {
      // Error de autenticación
      this.showError(response.message);
    }
  } catch (error) {
    this.showError('Error al iniciar sesión');
  }
}

async updateEmail(userId: number, email: string, password: string) {
  try {
    const response = await this.http.post(`${this.apiUrl}/auth/update-email`, {
      user_id: userId,
      email: email,
      password: password
    }).toPromise();

    if (response.success) {
      this.showSuccess(response.message);
      // Intentar login nuevamente con el email
      await this.login(email, password);
    } else {
      this.showError(response.message);
    }
  } catch (error) {
    this.showError('Error al actualizar email');
  }
}
```

### Componente de Modal para Actualizar Email

```typescript
// En el componente del modal
updateEmail() {
  if (!this.emailForm.valid) {
    return;
  }

  this.authService.updateEmail(
    this.userId,
    this.emailForm.value.email,
    this.emailForm.value.password
  ).subscribe(
    (response) => {
      if (response.success) {
        this.modal.close();
        // El servicio de auth manejará el re-login automático
      }
    },
    (error) => {
      this.errorMessage = error.error?.message || 'Error al actualizar email';
    }
  );
}
```

## 🔍 Lógica de Búsqueda

El sistema busca usuarios en el siguiente orden:

1. **Primero por Mail (email)** - Método nuevo preferido
2. **Si no encuentra, busca por User (username)** - Método antiguo
3. **Si encuentra por username pero no tiene Mail** → Requiere completar email
4. **Si encuentra por username y tiene Mail** → Login exitoso

## ✅ Validaciones Implementadas

- ✅ Validación de formato de email
- ✅ Verificación de contraseña antes de actualizar email
- ✅ Verificación de que el email no esté en uso por otro usuario
- ✅ Validación de usuario habilitado
- ✅ Manejo de errores completo

## 📝 Notas Importantes

1. **Compatibilidad hacia atrás**: Los usuarios pueden seguir usando username para login si tienen email configurado
2. **Migración gradual**: No todos los usuarios necesitan migrar al mismo tiempo
3. **Seguridad**: Se requiere verificar contraseña antes de actualizar email
4. **Unicidad**: El email debe ser único en el sistema

## 🧪 Casos de Prueba

### Caso 1: Usuario con email completo
- Login con email → ✅ Exitoso
- Login con username → ✅ Exitoso

### Caso 2: Usuario sin email
- Login con username → ⚠️ Requiere completar email
- Actualizar email → ✅ Email actualizado
- Login con email → ✅ Exitoso
- Login con username → ✅ Exitoso (ahora tiene email)

### Caso 3: Email duplicado
- Intentar actualizar con email existente → ❌ Error: "Email ya en uso"

### Caso 4: Contraseña incorrecta
- Intentar actualizar email con contraseña incorrecta → ❌ Error: "Contraseña incorrecta"

