# IDEA JAM

Generador de tópicos random para tu próxima landing, SaaS, juego o experimento web. Cada tirada cruza un formato y un nicho; la IA escribe el título, el pitch y las features, y el resultado se guarda en un historial local para volver a abrirlo cuando quieras.

## Qué incluye

- Generador con 14 formatos y 42 nichos.
- Brief generado con Gemini a partir de la clave del proveedor, con fallback local si la IA no está disponible.
- Tirada animada con atajo de teclado `G`.
- Brief completo con título, pitch, dificultad y checklist de features.
- Botón para copiar el brief como texto.
- Historial de las últimas 10 ideas completas en `localStorage`.
- Diseño neo-brutalista responsive, sin cuenta ni backend.

## Stack

- React 19 + TypeScript
- Vite 8
- Google Gemini API (`gemini-3.1-flash-lite` por defecto)
- CSS propio con tipografías Anton, Space Grotesk e IBM Plex Mono
- Componentes pixel de [Piixpal](https://piixpal.dvkk.dev/) v0.4.0 (MIT)

## Configuración de IA

Copia `.env.example` a `.env` y completa la clave:

```bash
cp .env.example .env
```

```env
AI_PROVIDER_API_KEY=tu_api_key
AI_PROVIDER_MODEL=gemini-3.1-flash-lite
```

La app llama a Gemini directamente desde el navegador, así que la clave se incluye en el bundle del cliente. Úsala solo en local o en un despliegue privado. Si falta la clave o la petición falla, el generador usa el modo local.

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
  lib/          IA, generación local, formato y almacenamiento
  types.ts      tipos del dominio
public/
  dist/         core y componentes vendorizados de Piixpal + licencia MIT
```

## Créditos

Los componentes pixel (`piix-sprite`, `piix-pal`, `piix-marquee`, `piix-flap`, `piix-divider`) pertenecen a [Piixpal](https://piixpal.dvkk.dev/) y se distribuyen bajo licencia MIT. El aviso completo está en `public/dist/PIIXPAL-LICENSE.txt`.

Hecho por [DylanZM](https://github.com/DylanZM).
