# Punto de partida — Centro de Control Comercial

Este documento resume el estado de la aplicación **personal** (v2.9) para usarla
como base en un proyecto separado (la versión **empresarial/multiusuario**).

Si eres un asistente o desarrollador que retoma este proyecto en otro hilo:
**parte del código de `centro-control-CODIGO-FUENTE.zip`, no lo reconstruyas.**

---

## Qué es la app

PWA (aplicación web progresiva) de gestión comercial para un ingeniero de ventas
de automatización industrial. Se entrega como un **único `index.html` autónomo**
(todo el código, estilos y librerías van incrustados) y se publica en GitHub Pages.

Diseño **HMI industrial**: fondo oscuro tipo bisel, acento ámbar, el color solo
aparece donde hay algo que atender (verde = ok, ámbar = atención, rojo = urgente).

---

## Cómo está construida

- **React 18 + Tailwind CSS**, compilada con **esbuild** a un solo archivo.
- Código fuente principal en **`app.jsx`** (~2,140 líneas). Módulos aparte:
  - `ilustraciones.jsx` — maquetas SVG de cada pantalla (para el manual ilustrado).
  - `xlsx.jsx` — generador de Excel con formato de moneda (usa fflate).
  - `nube.jsx` — **capa de nube: cliente Supabase, login y sincronización.**
  - `main.jsx` — punto de entrada.
- Se compila con `bash build.sh` → genera `dist/index.html`. Requiere Node 18+.
- El README del paquete explica el mapa de `app.jsx` y cómo compilar.

---

## Cómo guarda los datos (clave para la Etapa 2)

Todo el estado vive en un objeto `data` que se serializa a JSON:

- **Local:** `localStorage`, clave **`edb-centro-v1`**.
- **Nube (ya implementada):** tabla **`centro_estado`** en Supabase, un registro por
  usuario (`user_id`, `data` jsonb, `actualizado`), con seguridad por fila (RLS):
  cada usuario solo lee/escribe su propio registro.

**Los dos únicos puntos donde la app toca el almacenamiento** (buscar en `app.jsx`):
1. La función **`guardar`** — escribe local + sube a la nube (con debounce).
2. Los **`useEffect` de sincronización** — carga inicial, y "jalar" al reconectar o
   volver a la app.

La sesión se resuelve con `sesionActual()` / `alCambiarSesion()` de `nube.jsx`, y la
subida/bajada con `subirNube()` / `leerNube()`. La sincronización usa un sello de
tiempo `__actualizado` dentro de `data` (gana el más reciente).

Estructura del objeto `data`:
`tareas[]`, `tiempo[]`, `pipeline[]`, `metas{corto,mediano,largo}`, `mejoras[]`,
`visitas[]`, `timer`, `tipoCambio`, `tipoCambioFecha`, `__actualizado`.

Cada oportunidad de `pipeline[]` ya tiene: cliente, título, etapa, monto (en pesos),
moneda/montoOrig (para USD), margen, marca, plaza, **vendedor**, números y fechas de
cotización/OC/pedido/factura, comisión (% y pagada), próxima acción y notas.

> El campo **`vendedor`** ya existe en cada oportunidad: es el gancho natural para la
> Etapa 2 (asignar cartera por persona).

---

## Qué NUNCA debe cambiar

- El diseño HMI y la clave `edb-centro-v1` (compatibilidad de datos existentes).
- Debe seguir funcionando **sin internet** (local primero, nube después).
- Debe seguir entregándose como **un solo `index.html` autónomo**.
- **Conservar todos los campos de datos existentes** en cualquier cambio.

---

## Historial de versiones (resumen)

- v1.x — Tablero base: pendientes, tiempo, pipeline, metas, cierre; PWA; Google
  Calendar; asistente por voz; manual con novedades.
- v2.0–2.3 — Pipeline: resumen por mes, márgenes, comisiones por oportunidad, fechas
  de cotización/OC/pedido/factura, orden por etapa y monto, exportación a Excel con
  formato de moneda, total cotizado en la pantalla de inicio.
- v2.4 — **Pestaña Comisiones** (6ª): se alimenta de las facturadas, % por
  oportunidad, filtro por mes, totales de utilidad/comisión (pagada/pendiente).
- v2.5 — Buscador por número de cotización/OC/pedido/factura; campo **Vendedor**.
- v2.6 — Captura en **pesos o dólares** (todo se guarda en pesos); tipo de cambio en
  la pantalla de inicio (manual o automático por internet).
- v2.7 — **Módulo de Visitas** con check-in por GPS, resultado y foto del lugar.
- v2.8 — **Cuenta en la nube con Supabase**: login por correo y sincronización
  automática entre dispositivos (esta base).
- v2.9 — Visitas con fecha/hora de término y botón para agendar en Google Calendar.

---

## La Etapa 2 (empresarial) — hacia dónde va el otro proyecto

Objetivo: **cartera compartida con roles** (p. ej. gerente ve todo, cada vendedor lo
suyo). Esto implica dejar el modelo de "un bloque JSON por usuario" y **normalizar**
las oportunidades (y lo que se comparta) en tablas propias de Supabase, con columnas
de propietario y políticas RLS por rol. La app pasaría de leer/escribir el objeto
`data` completo a consultar tablas.

Recomendación para ese proyecto: hacerlo sobre una **copia separada** (repositorio y
proyecto de Supabase distintos) para no tocar esta versión personal.

---

*Documento de traspaso · app personal v2.9 · generado para continuidad en otro hilo.*
