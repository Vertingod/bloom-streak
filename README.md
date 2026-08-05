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
