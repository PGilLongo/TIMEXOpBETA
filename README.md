# TIMEX + Navegador (PWA)

## Qué es
Esta carpeta empaqueta tu `index.html` (split TIMEX + Navegador) como una **PWA instalable** (tipo “app” en móvil/escritorio).

## Archivos
- `index.html` → tu pantalla principal (con manifest + registro del SW).
- `NAVEGADOR.html` → mapa Leaflet + KMZ.
- `PDF TIMEX.html` → tu app TIMEX.
- `manifest.webmanifest` → metadata PWA.
- `service-worker.js` → caché offline del “app shell”.
- `icon-192.png`, `icon-512.png` → iconos.

## Cómo probar en local (IMPORTANTE: no funciona bien abriendo el HTML a pelo)
La PWA y la geolocalización necesitan **HTTPS** o **localhost**.

Opción rápida:
1) Abre una terminal dentro de esta carpeta.
2) Ejecuta:
   - Python 3:
     `python -m http.server 8000`
3) Abre en el navegador:
   `http://localhost:8000/`

## Instalar como app
- En Chrome/Edge (PC): icono “Instalar” en la barra de direcciones.
- En Android (Chrome): menú ⋮ → “Añadir a pantalla de inicio” / “Instalar aplicación”.
- En iPhone (Safari): botón compartir → “Añadir a pantalla de inicio”.
  (Nota: iOS tiene soporte PWA más limitado y el service worker puede comportarse distinto.)

## Offline
- La PWA cachea tus HTML + iconos.
- Los recursos externos (CDN de Leaflet/OSM tiles, etc.) se intentan guardar, pero si no hay conexión algunas cosas (tiles) pueden no cargar.
