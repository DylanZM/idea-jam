# IDEA JAM

Generador de tópicos random para tu próxima landing, SaaS, juego o experimento web. Cada tirada cruza un formato y un nicho; el resultado se guarda en un historial local para volver a abrirlo cuando quieras.

## Qué incluye

- Generador con 14 formatos y 42 nichos.
- Tirada animada con atajo de teclado `G`.
- Brief completo con título, pitch, dificultad y checklist de features.
- Botón para copiar el brief como texto.
- Historial de las últimas 10 ideas en `localStorage`.
- Diseño neo-brutalista responsive, sin cuenta ni backend.

## Stack

- React 19 + TypeScript
- Vite 8
- CSS propio con tipografías Anton, Space Grotesk e IBM Plex Mono
- Componentes pixel de [Piixpal](https://piixpal.dvkk.dev/) v0.4.0 (MIT)

## Desarrollo

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Estructura

```text
src/
  components/   UI: hero, generador, ticket, historial, cómo funciona, footer
  data/         formatos y nichos
  hooks/        historial persistente
  lib/          generación, formato y almacenamiento
  types.ts      tipos del dominio
public/
  dist/         core y componentes vendorizados de Piixpal + licencia MIT
```

## Créditos

Los componentes pixel (`piix-sprite`, `piix-pal`, `piix-marquee`, `piix-flap`, `piix-divider`) pertenecen a [Piixpal](https://piixpal.dvkk.dev/) y se distribuyen bajo licencia MIT. El aviso completo está en `public/dist/PIIXPAL-LICENSE.txt`.

Hecho por [DylanZM](https://github.com/DylanZM).
