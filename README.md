# BloomStreak

BloomStreak is a warm, garden-themed habit tracker built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, LocalStorage, and optional Supabase Auth + cloud sync.

## Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/dashboard
```

## Quality checks

```bash
npm run lint
npm run check-types
npm run test
npm run build
```

## Supabase setup

Supabase is optional. Without environment variables, BloomStreak keeps working in LocalStorage mode.

To enable Email Magic Link login and cloud sync, see:

```text
docs/supabase-setup.md
```

## PWA install experience

BloomStreak includes a lightweight PWA foundation with no extra runtime dependency:

- `src/app/manifest.ts` provides the installable web app manifest.
- `public/icons/` contains the app icons used by desktop/mobile install surfaces.
- `public/sw.js` caches the core shell and icons with a network-first navigation strategy.
- The dashboard shows a small install card when the browser exposes the PWA install prompt.

Local development can test the app shell at `http://localhost:3000/dashboard` or another Next.js dev port. For production, deploy over HTTPS so browsers can show the install flow.
