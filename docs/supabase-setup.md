# BloomStreak Supabase setup

Phase 4 adds optional Supabase Auth + cloud sync while keeping the LocalStorage MVP usable without cloud credentials.

## 1. Create environment file

Copy `.env.example` to `.env.local` and fill values from Supabase Project Settings > API:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Older projects may expose this value as an anon key; in that case you can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead.

## 2. Apply database migration

Run the SQL in:

```text
supabase/migrations/202608050001_bloom_streak_auth_sync.sql
```

It creates:

- `profiles`
- `habits`
- `checkins`
- Row Level Security policies so users can only access their own rows
- a unique check-in constraint on `(user_id, habit_id, date)`

## 3. Configure Auth redirect URL

In Supabase Auth URL settings, allow this local redirect URL during development:

```text
http://localhost:3000/auth/callback
```

For production, add your deployed callback URL as well:

```text
https://your-domain.com/auth/callback
```

## 4. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000/dashboard
```

If credentials are missing, the dashboard stays in local mode. If credentials are present, the dashboard shows the Email Magic Link sign-in panel. After sign-in, LocalStorage habits/check-ins are pushed to Supabase and future actions use Supabase repositories.
