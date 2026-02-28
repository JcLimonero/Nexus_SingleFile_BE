# Resumen: Usuarios de Prueba Creados

## ✅ Usuarios Creados

### Usuarios Administrativos

1. **Administrador Sistema** (ID: 1)
   - Usuario: `admin`
   - Contraseña: `admin123`
   - Email: admin@sistema.com
   - Rol: Administrador (ID: 7)
   - Agencias: Todas (8 agencias)
   - Procesos: Todos (3 procesos)

2. **Soporte Técnico** (ID: 2)
   - Usuario: `soporte`
   - Contraseña: `soporte123`
   - Email: soporte@sistema.com
   - Rol: Soporte (ID: 8)
   - Agencias: Todas (8 agencias)
   - Procesos: Todos (3 procesos)

3. **Auditor Sistema** (ID: 3)
   - Usuario: `auditor`
   - Contraseña: `auditor123`
   - Email: auditor@sistema.com
   - Rol: Auditoria (ID: 9)
   - Agencias: Todas (8 agencias) - Solo lectura
   - Procesos: Todos (3 procesos) - Solo lectura

4. **Gerente General** (ID: 4)
   - Usuario: `gerente`
   - Contraseña: `gerente123`
   - Email: gerente@sistema.com
   - Rol: Gerente (ID: 6)
   - Agencias: Primeras 4 agencias
   - Procesos: Todos (3 procesos)

5. **Coordinador Operación** (ID: 5)
   - Usuario: `coordinador`
   - Contraseña: `coord123`
   - Email: coordinador@sistema.com
   - Rol: Coordinador De Operación (ID: 5)
   - Agencias: Agencias Sur (5 agencias)
   - Procesos: Todos (3 procesos)

### Asesores (5 usuarios)

6. **Asesor Norte Autos Nuevos** (ID: 6)
   - Usuario: `asesor1`
   - Contraseña: `asesor123`
   - Email: asesor1@sistema.com
   - Rol: Asesor (ID: 1)
   - Agencias: Agencia Norte - Venta de Autos Nuevos (1 agencia)
   - Procesos: Autos Nuevos (1 proceso)

7. **Asesor Norte Completo** (ID: 7)
   - Usuario: `asesor2`
   - Contraseña: `asesor123`
   - Email: asesor2@sistema.com
   - Rol: Asesor (ID: 1)
   - Agencias: Agencias Norte (2 agencias)
   - Procesos: Autos Nuevos y Seminuevos (2 procesos)

8. **Asesor Premium** (ID: 8)
   - Usuario: `asesor3`
   - Contraseña: `asesor123`
   - Email: asesor3@sistema.com
   - Rol: Asesor (ID: 1)
   - Agencias: Agencia Premium - Showroom (1 agencia)
   - Procesos: Autos Nuevos (1 proceso)

9. **Asesor Sur Motos** (ID: 9)
   - Usuario: `asesor4`
   - Contraseña: `asesor123`
   - Email: asesor4@sistema.com
   - Rol: Asesor (ID: 1)
   - Agencias: Agencias Sur (3 agencias: Autos, Camionetas, Motos)
   - Procesos: Motos Nuevos (1 proceso)

10. **Asesor Multiagencia** (ID: 10)
    - Usuario: `asesor5`
    - Contraseña: `asesor123`
    - Email: asesor5@sistema.com
    - Rol: Asesor (ID: 1)
    - Agencias: Múltiples agencias (4 agencias)
    - Procesos: Todos (3 procesos)

## 📊 Resumen de Permisos

### Por Rol:
- **Administrador**: Acceso completo a todas las agencias y procesos
- **Soporte**: Acceso completo a todas las agencias y procesos
- **Auditor**: Acceso de solo lectura a todas las agencias y procesos
- **Gerente**: Acceso a 4 agencias principales y todos los procesos
- **Coordinador**: Acceso a agencias Sur y todos los procesos
- **Asesores**: Combinaciones variadas según especialización

### Combinaciones de Asesores:
1. **Asesor especializado**: 1 agencia + 1 proceso
2. **Asesor multiagencia**: 2 agencias + 2 procesos
3. **Asesor premium**: 1 agencia premium + 1 proceso
4. **Asesor temático**: 3 agencias + 1 proceso específico
5. **Asesor completo**: 4 agencias + todos los procesos

## 🔑 Contraseñas

Todas las contraseñas están hasheadas con `password_hash()` de PHP.
Las contraseñas en texto plano son:
- admin: `admin123`
- soporte: `soporte123`
- auditor: `auditor123`
- gerente: `gerente123`
- coordinador: `coord123`
- asesores: `asesor123`

## ✅ Estado

Todos los usuarios están:
- ✅ Habilitados (`Enabled = 1`)
- ✅ Con contraseñas hasheadas
- ✅ Con agencias asignadas según su rol
- ✅ Con procesos asignados según su rol
- ✅ Con fechas de registro y actualización
