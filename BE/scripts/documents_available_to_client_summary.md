# Resumen: Documentos Disponibles para Cliente

## Operación Realizada

Se marcaron 14 documentos específicos con `AvailableToClient = 1` en la tabla `document_type`.

## Documentos Marcados

Los siguientes documentos fueron marcados como disponibles para cliente:

1. **Identificacion Oficial** (ID: 1)
2. **CURP** (ID: 2)
3. **RFC** (ID: 3)
4. **Constancia de Situación Fiscal** (ID: 35)
5. **Comprobante de Domicilio** (ID: 6)
6. **Formato de Uso de CFDI** (ID: 39)
7. **Acta Constitutiva** (ID: 7)
8. **Poder de Representante Legal** (ID: 8)
9. **Identificacion Oficial Apoderado** (ID: 45)
10. **Beneficiario Controlador** (ID: 62)
11. **Carta Compromiso de Pago** (ID: 26)
12. **Factura Original Endosada** (ID: 59)
13. **Refrendos Consecutivos Ultimos 5 Años** (ID: 16)
14. **Constancia de Verificacion Vehicular** (ID: 57)

## Resultados

- **Documentos encontrados:** 14
- **Documentos actualizados:** 14
- **Documentos ya marcados:** 0
- **Errores:** 0
- **Total de documentos disponibles para cliente:** 14

## Campo Actualizado

- **Campo:** `AvailableToClient`
- **Valor anterior:** 0 (no disponible)
- **Valor nuevo:** 1 (disponible)
- **Campo adicional actualizado:** `UpdateDate` = NOW()

## Uso

Los documentos marcados con `AvailableToClient = 1` pueden ser:
- Visibles para los clientes en el portal o aplicación
- Subidos por los clientes directamente
- Consultados por los clientes en su área de documentos

## Consultas Útiles

### Obtener todos los documentos disponibles para cliente
```sql
SELECT Id, Name, AvailableToClient 
FROM document_type 
WHERE AvailableToClient = 1 
ORDER BY Name;
```

### Obtener documentos NO disponibles para cliente
```sql
SELECT Id, Name, AvailableToClient 
FROM document_type 
WHERE AvailableToClient = 0 OR AvailableToClient IS NULL
ORDER BY Name;
```

### Contar documentos disponibles
```sql
SELECT 
    COUNT(*) as total_documents,
    SUM(CASE WHEN AvailableToClient = 1 THEN 1 ELSE 0 END) as available_to_client,
    SUM(CASE WHEN AvailableToClient = 0 OR AvailableToClient IS NULL THEN 1 ELSE 0 END) as not_available
FROM document_type;
```

## Archivos Creados

- `BE/DB/migrations/028_mark_documents_available_to_client.sql` - Migración SQL
- `BE/scripts/mark_documents_available_to_client.php` - Script de ejecución
- `BE/scripts/documents_available_to_client_summary.md` - Este documento

## Notas

- El campo `AvailableToClient` es de tipo TINYINT(1)
- Valor 1 = Disponible para cliente
- Valor 0 = No disponible para cliente
- NULL = No disponible para cliente (tratado como 0)
- El campo `UpdateDate` se actualizó automáticamente para cada documento modificado
