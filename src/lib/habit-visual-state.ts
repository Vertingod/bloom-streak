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
    seed: "今天轻轻开始，先浇一小滴水。",
    sprout: "小芽已经冒头，继续保持节奏。",
    bloom: "连续绽放中，这株习惯很有生命力。",
    resting: "这株习惯暂时休眠，不计入今日进度。",
  };

  return messages[state];
}
