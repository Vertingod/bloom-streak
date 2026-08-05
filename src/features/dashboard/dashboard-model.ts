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
  allHabits: DashboardHabit[];
  progress: ReturnType<typeof calculateTodayProgress>;
  perfectDayCount: number;
};

export function buildDashboardModel(input: {
  habits: Habit[];
  checkins: HabitCheckin[];
  todayDateKey: string;
}): DashboardModel {
  const sortedHabits = [...input.habits].sort(
    (a, b) => a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt),
  );
  const dueHabits = sortedHabits.filter((habit) => isHabitDueOn(habit, input.todayDateKey));
  const allHabits = sortedHabits.map((habit) => {
    const habitCheckins = input.checkins.filter((checkin) => checkin.habitId === habit.id);
    const stats = calculateHabitStats(habitCheckins, input.todayDateKey);

    return {
      ...habit,
      ...stats,
    };
  });

  return {
    todayDateKey: input.todayDateKey,
    habits: allHabits.filter((habit) => isHabitDueOn(habit, input.todayDateKey)),
    allHabits,
    progress: calculateTodayProgress(dueHabits, input.checkins, input.todayDateKey),
    perfectDayCount: calculatePerfectDayCount(sortedHabits, input.checkins, input.todayDateKey),
  };
}


function calculatePerfectDayCount(habits: Habit[], checkins: HabitCheckin[], todayDateKey: string) {
  const candidateDates = Array.from(
    new Set(checkins.map((checkin) => checkin.date).filter((date) => date <= todayDateKey)),
  );

  return candidateDates.filter((date) => calculateTodayProgress(habits, checkins, date).allDone).length;
}
