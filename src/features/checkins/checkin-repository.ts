import type { HabitCheckin } from "@/features/habits/types";

export type CheckinRepository = {
  listCheckins(userId: string | null): Promise<HabitCheckin[]>;
  listCheckinsForHabit(habitId: string): Promise<HabitCheckin[]>;
  completeHabit(input: {
    userId: string | null;
    habitId: string;
    date: string;
    completedAt: string;
    note?: string | null;
  }): Promise<HabitCheckin>;
};

export function getCheckinUniqueKey(input: Pick<HabitCheckin, "userId" | "habitId" | "date">) {
  return `${input.userId ?? "local-user"}:${input.habitId}:${input.date}`;
}
