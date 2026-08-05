import type { Habit, HabitDraft } from "@/features/habits/types";

export type HabitRepository = {
  listHabits(userId: string | null): Promise<Habit[]>;
  createHabit(userId: string | null, draft: HabitDraft): Promise<Habit>;
  updateHabit(habitId: string, patch: Partial<HabitDraft>): Promise<Habit>;
  archiveHabit(habitId: string): Promise<Habit>;
};
