import type { DayCompletion } from "@/lib/habit-stats";
import {
  calculateHabitStats,
  calculateTodayProgress,
  isHabitDueOn,
} from "@/lib/habit-stats";
import type { Habit, HabitCheckin, HabitWithStats } from "@/features/habits/types";

export type DashboardHabit = HabitWithStats & {
  last7Days: DayCompletion[];
  last30Days: DayCompletion[];
};

export type DashboardModel = {
  todayDateKey: string;
  habits: DashboardHabit[];
  progress: ReturnType<typeof calculateTodayProgress>;
};

export function buildDashboardModel(input: {
  habits: Habit[];
  checkins: HabitCheckin[];
  todayDateKey: string;
}): DashboardModel {
  const dueHabits = input.habits
    .filter((habit) => isHabitDueOn(habit, input.todayDateKey))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt));

  return {
    todayDateKey: input.todayDateKey,
    habits: dueHabits.map((habit) => {
      const habitCheckins = input.checkins.filter((checkin) => checkin.habitId === habit.id);
      const stats = calculateHabitStats(habitCheckins, input.todayDateKey);

      return {
        ...habit,
        ...stats,
      };
    }),
    progress: calculateTodayProgress(dueHabits, input.checkins, input.todayDateKey),
  };
}
