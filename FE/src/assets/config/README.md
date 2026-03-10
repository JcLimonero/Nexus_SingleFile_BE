# Configuración de branding (logos y nombre del cliente)

Para desplegar la aplicación en otro cliente **sin recompilar**, edita o reemplaza el archivo `branding.json` en esta carpeta.

## Archivo: `branding.json`

| Campo       | Descripción |
|------------|-------------|
| `clientName` | Nombre del cliente (footer y referencias de texto). |
| `appTitle`   | Título que aparece en el menú lateral (sidebar). Si no se define, se usa `clientName`. |
| `pageTitle`  | Título de la pestaña del navegador (ej: `"Expediente Único by Grupo NexFile"`). Si no se define, se usa `appTitle + " by " + clientName`. |
| `layoutStyle` | Estilo de layout/template: `apollo`, `poseidon`, `hermes`, `ares`, `zeus`, `ikaros`. Define la disposición del menú, toolbar y footer. Por defecto `poseidon`. |
| `logoLogin`  | Ruta del logo en la pantalla de **login** (ej: `assets/img/icons/logos/logo_login.svg`). |
| `logoApp`    | Ruta del logo en el **toolbar** (barra superior) y en el **menú lateral** (sidebar). |
| `logoFooter` | Ruta del logo en el **footer**. |
| `logoLoading` | Imagen del **splash/loading** que se muestra mientras carga la app (entre pantallas). |
| `footerLink`| URL del enlace del footer (al hacer clic en el logo/nombre). |

## Rutas de imágenes

- Las rutas son relativas al origen de la app (por ejemplo `assets/img/icons/logos/mi_logo.svg`).
- Puedes usar SVG o PNG. Para un cliente nuevo, sube sus logos a `assets/img/icons/logos/` y referencia aquí el nombre del archivo.

## Ejemplo para otro cliente

```json
{
  "clientName": "Acme Corp",
  "appTitle": "Expediente Único",
  "pageTitle": "Expediente Único by Acme Corp",
  "layoutStyle": "poseidon",
  "logoLogin": "assets/img/icons/logos/acme_login.svg",
  "logoApp": "assets/img/icons/logos/acme_logo.svg",
  "logoFooter": "assets/img/icons/logos/acme_logo.svg",
  "logoLoading": "assets/img/icons/logos/acme_loading.svg",
  "footerLink": "https://www.acme.com"
}
```

La aplicación carga este JSON al iniciar; si el archivo no existe o falla la carga, se usan los valores por defecto (Grupo NexFile).
