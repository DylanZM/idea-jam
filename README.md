# IDEA JAM

A random topic generator for your next landing page, SaaS, game or web experiment. The AI writes the format, niche, title, a clear description and what the project must include from scratch; every result is saved to a local history so you can reopen it later.

## What it includes

- Ideas generated from scratch with AI, no fixed catalogs or templates.
- Bilingual Spanish/English interface with a persistent language selector.
- Switching language also translates the idea currently on screen.
- Brief with format, niche, title, description, difficulty and a checklist of what the project must include.
- New ideas that avoid repeating the format, niche or title of recent ones.
- Animated roll with the `G` keyboard shortcut.
- Local anti-abuse limit: 5 ideas per minute, 100 per day and 5 s between rolls.
- Button to copy the brief as text.
- History of the last 10 complete ideas in `localStorage`.
- Responsive neo-brutalist design with animated icons, no account or backend.

## Stack

- React 19 + TypeScript
- Vite 8
- Google Gemini API (`gemini-3.1-flash-lite` by default)
- Custom CSS with Archivo Black, Space Grotesk and JetBrains Mono typefaces
- Animated icons from [AnimateIcons](https://animateicons.in/)
- Pixel components from [Piixpal](https://piixpal.dvkk.dev/) v0.4.0 (MIT)

## AI setup

Copy `.env.example` to `.env` and fill in the key:

```bash
cp .env.example .env
```

```env
AI_PROVIDER_API_KEY=your_api_key
AI_PROVIDER_MODEL=gemini-3.1-flash-lite
```

The app calls Gemini directly from the browser, so the key is included in the client bundle. Use this only locally or in a private deployment. If the key is missing or the request fails, the app shows an error and keeps the last generated idea.

The generation limit runs on the client: it prevents accidental use and double clicks, but it does not protect the key from someone inspecting the bundle. For a public deployment, move the request to a backend or proxy with the key kept off the client.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Structure

```text
src/
  components/   UI: hero, generator, ticket, history, how it works, footer
  hooks/        persistent history and generation limit
  lib/          AI, identifiers, formatting, rate limit and storage
  i18n.tsx      ES/EN translations and language provider
  types.ts      domain types
public/
  dist/         vendored Piixpal core and components + MIT license
```

## Credits

The pixel components (`piix-sprite`, `piix-pal`, `piix-marquee`, `piix-flap`, `piix-divider`) belong to [Piixpal](https://piixpal.dvkk.dev/) and are distributed under the MIT license. The full notice is in `public/dist/PIIXPAL-LICENSE.txt`.

Animated icons are provided by [AnimateIcons](https://animateicons.in/).

Made by [DylanZM](https://github.com/DylanZM).
