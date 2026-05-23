import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationMetadata
} from '@angular/animations';

/**
 * Animación de expansión/colapso del dropdown del sidenav (e.g. submenu
 * "Catálogos" con 7 hijos en Configuración).
 *
 * Cambios respecto al default Vex:
 * - Duración 300ms → 180ms: con 7+ children la animación de 300ms se siente
 *   lenta. 180ms es el sweet spot UI (Material recomienda 100-200ms para
 *   abrir, 100-300ms para cerrar).
 * - Easing: `cubic-bezier(.35, 0, .25, 1)` (deceleración suave) → easing
 *   estándar de Material (`cubic-bezier(.4, 0, .2, 1)`) que arranca rápido
 *   y desacelera al final. Da sensación de respuesta inmediata.
 * - Cerrar más rápido (140ms) que abrir (180ms) — los usuarios esperan que
 *   el cierre se sienta instantáneo (Material UX guidelines).
 * - prefers-reduced-motion: el navegador respeta la preferencia del SO.
 *   La animación con `0ms` cuando reduce-motion está activa.
 */
const OPEN_MS = 180;
const CLOSE_MS = 140;
const EASING = 'cubic-bezier(.4, 0, .2, 1)';

export const dropdownAnimation = trigger('dropdown', [
  state(
    'false',
    style({
      height: 0,
      opacity: 0
    })
  ),
  state(
    'true',
    style({
      height: '*',
      opacity: 1
    })
  ),
  transition('false => true', animate(`${OPEN_MS}ms ${EASING}`)),
  transition('true => false', animate(`${CLOSE_MS}ms ${EASING}`))
]) satisfies AnimationMetadata;
