# BloomStreak Phase 1 Design

## Product direction

BloomStreak is a mobile-first habit check-in app with a warm garden metaphor. The MVP should feel like a small polished product instead of an admin dashboard: each habit is a plant, each check-in waters it, and streaks make it bloom.

## Naming

- Product name: BloomStreak
- Package/repo name: `bloom-streak`
- Chinese tagline: ??????????

## Phase 1 scope

Phase 1 initializes the project and lays the technical/design foundation. It does not implement Supabase, authentication, or full CRUD.

Included:

- Next.js App Router project with TypeScript and Tailwind CSS
- shadcn/ui setup
- Dawn greenhouse visual tokens
- Initial landing page
- Supabase-ready Habit and HabitCheckin types
- Date utilities with explicit timezone handling
- Streak/progress pure utilities
- Repository interfaces for future LocalStorage and Supabase implementations

Excluded:

- Supabase Auth and database migrations
- Full Dashboard CRUD
- PWA installation flow
- AI coach, social, leaderboard, payment, complex reminder systems

## Data model baseline

Habit:

- id
- userId
- name
- category
- color
- icon
- frequency
- startDate
- archived
- displayOrder
- createdAt
- updatedAt

HabitCheckin:

- id
- habitId
- userId
- date as YYYY-MM-DD
- completedAt
- optional note
- createdAt

## Key safety decisions

- Do not use `new Date().toISOString().slice(0, 10)` directly in UI components for today checks.
- Keep streak calculations as pure utilities so they can be tested independently.
- Keep data access behind repository interfaces to make LocalStorage to Supabase migration safer.
- Do not introduce database changes in Phase 1.
