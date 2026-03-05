# Plan v2.0 – Verificación de identidad en miniportal

## Objetivo

Validar que quien sube documentos sea el titular del expediente mediante selfie + foto del INE + AWS Rekognition.

## Alcance

- **Opciones evaluadas**: A (solo INE), B (selfie + INE + Rekognition), C (Onfido/Jumio).
- **Decisión**: Opción B (selfie + INE + AWS Rekognition).

## Flujo propuesto

1. Usuario acepta aviso de confidencialidad.
2. Antes de subir documentos → modal de verificación de identidad.
3. Paso 1: selfie.
4. Paso 2: foto del INE (donde se vea el rostro).
5. Backend compara caras con AWS Rekognition.
6. Si coincide → permitir subir documentos.

## Entregables técnicos

| Área | Tarea |
|------|-------|
| **Frontend** | `IdentityVerificationDialogComponent` (2 pasos, cámara) |
| **Frontend** | Integración en `ConsultaMiniportalComponent` |
| **Frontend** | Método `verifyIdentity()` en `MiniportalService` |
| **Backend** | Endpoint `POST /api/miniportal/:token/verify-identity` |
| **Backend** | Integración AWS Rekognition (`DetectFaces`, `CompareFaces`) |
| **BD (opcional)** | Tabla para persistir verificación por expediente |

## Dependencias

- Credenciales AWS (Rekognition).
- SDK AWS para PHP.

## Coste estimado

~0.003 USD por verificación.

## Limitaciones conocidas

- Sin liveness (riesgo de spoofing).
- Depende de calidad de cámara e iluminación.
