import { describe, expect, it } from "vitest";

import type { Habit, HabitCheckin } from "@/features/habits/types";
import {
  buildLocalToSupabaseSyncPayload,
  mapCheckinRowToCheckin,
  mapHabitRowToHabit,
} from "../supabase-repository";

const habit: Habit = {
  id: "habit-1",
  userId: "local-user",
  name: "Read English",
  category: "study",
  color: "sage",
  icon: "book-open",
  frequency: "daily",
  startDate: "2026-08-05",
  archived: false,
  displayOrder: 2,
  createdAt: "2026-08-05T01:00:00.000Z",
  updatedAt: "2026-08-05T02:00:00.000Z",
};

const checkin: HabitCheckin = {
  id: "checkin-1",
  userId: "local-user",
  habitId: "habit-1",
  date: "2026-08-05",
  completedAt: "2026-08-05T03:00:00.000Z",
  note: null,
  createdAt: "2026-08-05T03:00:00.000Z",
};

describe("Supabase repository mapping", () => {
  it("maps snake_case Supabase rows to app habit and checkin types", () => {
    expect(
      mapHabitRowToHabit({
        id: habit.id,
        user_id: "user-1",
        name: habit.name,
        category: habit.category,
        color: habit.color,
        icon: habit.icon,
        frequency: habit.frequency,
        start_date: habit.startDate,
        archived: habit.archived,
        display_order: habit.displayOrder,
        created_at: habit.createdAt,
        updated_at: habit.updatedAt,
      }),
    ).toEqual({ ...habit, userId: "user-1" });

    expect(
      mapCheckinRowToCheckin({
        id: checkin.id,
        user_id: "user-1",
        habit_id: checkin.habitId,
        date: checkin.date,
        completed_at: checkin.completedAt,
        note: checkin.note ?? null,
        created_at: checkin.createdAt,
      }),
    ).toEqual({ ...checkin, userId: "user-1" });
  });

  it("builds deduplicated upsert payloads when pushing local data to a Supabase user", () => {
    const payload = buildLocalToSupabaseSyncPayload({
      habits: [habit],
      checkins: [checkin, { ...checkin, id: "checkin-duplicate" }],
      localUserId: "local-user",
      remoteUserId: "user-1",
    });

    expect(payload.habits).toEqual([
      {
        id: habit.id,
        user_id: "user-1",
        name: habit.name,
        category: habit.category,
        color: habit.color,
        icon: habit.icon,
        frequency: habit.frequency,
        start_date: habit.startDate,
        archived: habit.archived,
        display_order: habit.displayOrder,
        created_at: habit.createdAt,
        updated_at: habit.updatedAt,
      },
    ]);

    expect(payload.checkins).toEqual([
      {
        id: checkin.id,
        user_id: "user-1",
        habit_id: checkin.habitId,
        date: checkin.date,
        completed_at: checkin.completedAt,
        note: checkin.note ?? null,
        created_at: checkin.createdAt,
      },
    ]);
  });
});
