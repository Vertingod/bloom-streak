import { getHabitAchievementBadges, type Achievement } from "@/features/achievements/achievement-rules";
import type { DashboardHabit } from "@/features/dashboard/dashboard-model";

export type HabitDetailSummary = {
  last30Completed: number;
  last30Total: number;
  last30Percentage: number;
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
};

export function buildHabitDetailSummary(input: {
  habit: DashboardHabit;
  habits: DashboardHabit[];
  todayAllDone: boolean;
}): HabitDetailSummary {
  const last30Completed = input.habit.last30Days.filter((day) => day.completed).length;
  const last30Total = input.habit.last30Days.length;
  const last30Percentage = last30Total === 0 ? 0 : Math.round((last30Completed / last30Total) * 100);
  const achievements = getHabitAchievementBadges({ stats: input.habit });

  return {
    last30Completed,
    last30Total,
    last30Percentage,
    unlockedAchievements: achievements.filter((achievement) => achievement.unlocked),
    lockedAchievements: achievements.filter((achievement) => !achievement.unlocked),
  };
}
