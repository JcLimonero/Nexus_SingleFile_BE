# Plan de Desarrollo – SingleFile / NexFile

## 1. Miniportal (Prioridad alta)

Portal público de consulta de expediente al que el cliente accede mediante enlace único enviado por WhatsApp.

### Alcance
- Enlace único por expediente (token UUID)
- Sin login; acceso por URL
- Aceptar aviso de confidencialidad con firma
- Subir documentos
- Ver documentos del expediente
- Firmar acuerdo con los documentos
- **Geolocalización** capturada del dispositivo en cada acción relevante
- Botón "Compartir por WhatsApp" (wa.me) en la app principal

### Entregables
- Migraciones SQL: `File_ShareToken`, `File_ShareToken_Acceptance`, `File_ShareToken_GeoLog`
- API pública: generar token, aceptar aviso, subir documento, firmar documentos
- Componente Angular: `/consulta/:token` (sin auth)
- Integración en Validación o Cliente detalle

---

## 2. Aviso de privacidad en agencia (Prioridad alta)

### Alcance
- Checkbox "Aviso de privacidad entregado/aceptado" en expediente o cliente
- Campos: `avisoPrivacidadFecha`, `avisoPrivacidadMetodo`
- PDF descargable del aviso

---

## 3. Beneficiario final y proveedor de recursos (Prioridad alta)

### Alcance
- Campos en cliente/expediente
- Formulario en integración o validación
- Indicador cuando falten datos en expedientes de alto riesgo

### Flujo en expedientes
- **Integración:** Al registrar el pedido, si se detecta que la factura es a tercero o que es persona moral, capturar beneficiario final.
- **Validación:** Antes de liberar, verificar que el beneficiario final esté identificado cuando aplique.
- **Reportes:** Para el Oficial de Cumplimiento, expedientes sin beneficiario final cuando debía capturarse.

---

## 4. Registro de auditoría PLD (Prioridad alta)

### Alcance
- Tabla `PLD_AuditLog`
- Registro de acciones relevantes
- Reporte exportable para auditorías

---

## 5. Indicador de expediente PLD completo (Prioridad media)

### Alcance
- Badge "Expediente PLD completo"
- Filtro "Solo expedientes PLD incompletos"

---

## 6. Dashboard de cumplimiento PLD (Prioridad media)

### Alcance
- Widgets: clientes en umbral, expedientes incompletos, tendencias
- Integración en dashboard global

---

## 7. Umbral PLD por razón social (Prioridad baja)

### Alcance
- Configuración de umbral por compañía
- Fallback al umbral global

---

## 8. CIF vs CSF (Prioridad baja)

### Alcance
- Campo "Tipo de identificación: CIF / CSF"
- Validación según tipo

---

## Orden sugerido de implementación

| Fase | Ítem | Esfuerzo estimado |
|------|------|-------------------|
| 1 | Miniportal | 2-3 semanas |
| 2 | Aviso de privacidad en agencia | 1 semana |
| 3 | Beneficiario final / Proveedor de recursos | 1-2 semanas |
| 4 | Auditoría PLD | 1 semana |
| 5 | Indicador expediente PLD completo | 3-5 días |
| 6 | Dashboard cumplimiento PLD | 1 semana |
| 7 | Umbral por razón social | 2-3 días |
| 8 | CIF vs CSF | 2-3 días |
