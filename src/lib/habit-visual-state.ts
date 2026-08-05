import type { Habit, HabitCheckin } from "@/features/habits/types";
import { calculateHabitStats } from "@/lib/habit-stats";

export type HabitVisualState = "seed" | "sprout" | "bloom" | "resting";

export function getHabitVisualState(
  habit: Habit,
  checkins: HabitCheckin[],
  todayDateKey: string,
): HabitVisualState {
  if (habit.archived) {
    return "resting";
  }

  const stats = calculateHabitStats(checkins, todayDateKey);

  if (stats.completedToday && stats.currentStreak >= 7) {
    return "bloom";
  }

  if (stats.completedToday || stats.currentStreak >= 2) {
    return "sprout";
  }

  return "seed";
}

export function getHabitEncouragement(state: HabitVisualState) {
  const messages: Record<HabitVisualState, string> = {
    seed: "??????????????",
    sprout: "??????????????",
    bloom: "????????????????",
    resting: "?????????????????",
  };

  return messages[state];
}
