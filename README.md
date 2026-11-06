# IDEA JAM

Generador de tópicos random para tu próxima landing, SaaS, juego o experimento web. La IA genera desde cero el formato, el nicho, el título, una descripción clara y lo que el proyecto tiene que tener; el resultado se guarda en un historial local para volver a abrirlo cuando quieras.

## Qué incluye

- Ideas generadas desde cero con IA, sin catálogos ni plantillas fijas.
- Brief con formato, nicho, título, descripción, dificultad y checklist de lo que el proyecto tiene que tener.
- Tirada animada con atajo de teclado `G`.
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

La app llama a Gemini directamente desde el navegador, así que la clave se incluye en el bundle del cliente. Úsala solo en local o en un despliegue privado. Si falta la clave o la petición falla, la app muestra un error y conserva la última idea generada.

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
  hooks/        historial persistente
  lib/          IA, identificadores, formato y almacenamiento
  types.ts      tipos del dominio
public/
  dist/         core y componentes vendorizados de Piixpal + licencia MIT
```

## Créditos

Los componentes pixel (`piix-sprite`, `piix-pal`, `piix-marquee`, `piix-flap`, `piix-divider`) pertenecen a [Piixpal](https://piixpal.dvkk.dev/) y se distribuyen bajo licencia MIT. El aviso completo está en `public/dist/PIIXPAL-LICENSE.txt`.

Hecho por [DylanZM](https://github.com/DylanZM).
