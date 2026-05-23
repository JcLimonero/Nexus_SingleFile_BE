# Jerarquía oficial de botones — Nexus FE

Esta guía busca eliminar la inconsistencia detectada en la auditoría de UX
(mezcla de `mat-raised-button` / `mat-stroked-button` / `mat-flat-button`
sin criterio claro entre páginas).

## Reglas

### 1. Acción primaria (1 por sección)

Lo que el usuario quiere hacer principalmente en esta pantalla / dialog.

```html
<button mat-flat-button color="primary">
  Guardar
</button>
```

Ejemplos: **Guardar**, **Crear**, **Buscar**, **Aplicar filtros**, **Confirmar**.

### 2. Acción secundaria

Acciones alternativas o de navegación menos prominentes.

```html
<button mat-stroked-button color="primary">
  Exportar
</button>
```

Ejemplos: **Exportar**, **Importar**, **Reintentar**, **Ver detalle**.

### 3. Acción destructiva confirmada

Solo dentro de un dialog de confirmación, NUNCA en la pantalla principal.

```html
<button mat-flat-button color="warn">
  Sí, eliminar definitivamente
</button>
```

Ejemplos: **Eliminar**, **Cancelar pedido**, **Rechazar documento**.

### 4. Acción de cancelar / cerrar

```html
<button mat-button>Cancelar</button>
```

Sin color, sin borde. Visualmente debe ser menos prominente que la primaria.

### 5. Acción terciaria (iconos / links)

Para acciones secundarias en filas de tabla, headers, etc.

```html
<!-- Botón de icono con tooltip y aria-label SIEMPRE -->
<button mat-icon-button
        matTooltip="Editar"
        aria-label="Editar usuario {{ user.Name }}">
  <mat-icon aria-hidden="true">edit</mat-icon>
</button>
```

## Tabla de decisión

| Situación | Botón |
|---|---|
| Submit principal del form | `mat-flat-button color="primary"` |
| Acción secundaria útil pero opcional | `mat-stroked-button color="primary"` |
| Eliminar/cancelar/rechazar dentro de dialog destructivo | `mat-flat-button color="warn"` |
| Cancelar / Cerrar dialog | `mat-button` (sin color) |
| Acción en fila de tabla | `mat-icon-button` (con `aria-label`) |
| Toggle visual (favorito, expand) | `mat-icon-button` |

## Anti-patrones detectados

- ❌ `mat-raised-button color="warn"` para "Limpiar" — usar `mat-stroked-button` (no es destructivo)
- ❌ `mat-icon-button` sin `aria-label` (depende de `matTooltip` que no leen los lectores de pantalla)
- ❌ `<button>` HTML puro sin `mat-*` (rompe theming y accesibilidad)
- ❌ Dos `mat-flat-button color="primary"` lado a lado (genera confusión sobre cuál es la acción primaria)

## Estado actual

Esta guía se está aplicando gradualmente. Páginas ya alineadas: ninguna 100%. Próximos sweeps:
- `mesa-control/validacion`
- `procesos/integracion`, `liquidacion`, `liberacion`
- `configuracion/*`
