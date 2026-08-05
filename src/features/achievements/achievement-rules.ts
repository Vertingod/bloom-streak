import type { Habit } from "@/features/habits/types";
import type { HabitStats } from "@/lib/habit-stats";

export type Achievement = {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
};

export function getAchievementBadges(input: {
  habits: Habit[];
  stats: HabitStats;
  todayAllDone: boolean;
}): Achievement[] {
  return [
    {
      id: "first-sprout",
      label: "?????",
      description: "????????",
      unlocked: input.stats.totalCheckins >= 1,
    },
    {
      id: "three-day-rhythm",
      label: "????",
      description: "???? 3 ??",
      unlocked: input.stats.currentStreak >= 3,
    },
    {
      id: "seven-day-bloom",
      label: "????",
      description: "???? 7 ??",
      unlocked: input.stats.currentStreak >= 7,
    },
    {
      id: "garden-keeper",
      label: "?????",
      description: "???? 5 ??????",
      unlocked: input.habits.filter((habit) => !habit.archived).length >= 5,
    },
    {
      id: "perfect-day",
      label: "?????",
      description: "?????????",
      unlocked: input.todayAllDone,
    },
  ];
}
