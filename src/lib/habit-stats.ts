import type { Habit, HabitCheckin } from "@/features/habits/types";
import { addDays, getRecentDateKeys, isDateKeyOnOrBefore } from "@/lib/date";

export type DayCompletion = {
  date: string;
  completed: boolean;
};

export type HabitStats = {
  completedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCheckins: number;
  last7Days: DayCompletion[];
  last30Days: DayCompletion[];
};

export function getCheckinDateSet(checkins: HabitCheckin[]) {
  return new Set(checkins.map((checkin) => checkin.date));
}

export function isHabitActiveOn(habit: Habit, dateKey: string) {
  return !habit.archived && isDateKeyOnOrBefore(habit.startDate, dateKey);
}

export function isHabitDueOn(habit: Habit, dateKey: string) {
  if (!isHabitActiveOn(habit, dateKey)) {
    return false;
  }

  if (habit.frequency === "daily") {
    return true;
  }

  const day = new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  return day >= 1 && day <= 5;
}

export function calculateCurrentStreak(checkins: HabitCheckin[], todayDateKey: string) {
  const completedDates = getCheckinDateSet(checkins);
  const startDate = completedDates.has(todayDateKey)
    ? todayDateKey
    : addDays(todayDateKey, -1);

  let cursor = startDate;
  let streak = 0;

  while (completedDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function calculateLongestStreak(checkins: HabitCheckin[]) {
  const dates = Array.from(getCheckinDateSet(checkins)).sort();
  let longest = 0;
  let current = 0;
  let previous: string | null = null;

  for (const date of dates) {
    if (!previous || addDays(previous, 1) === date) {
      current += 1;
    } else {
      current = 1;
    }

    longest = Math.max(longest, current);
    previous = date;
  }

  return longest;
}

export function getCompletionWindow(
  checkins: HabitCheckin[],
  days: number,
  endDateKey: string,
): DayCompletion[] {
  const completedDates = getCheckinDateSet(checkins);

  return getRecentDateKeys(days, endDateKey).map((date) => ({
    date,
    completed: completedDates.has(date),
  }));
}

export function calculateHabitStats(checkins: HabitCheckin[], todayDateKey: string): HabitStats {
  return {
    completedToday: getCheckinDateSet(checkins).has(todayDateKey),
    currentStreak: calculateCurrentStreak(checkins, todayDateKey),
    longestStreak: calculateLongestStreak(checkins),
    totalCheckins: getCheckinDateSet(checkins).size,
    last7Days: getCompletionWindow(checkins, 7, todayDateKey),
    last30Days: getCompletionWindow(checkins, 30, todayDateKey),
  };
}

export function calculateTodayProgress(
  habits: Habit[],
  checkins: HabitCheckin[],
  todayDateKey: string,
) {
  const dueHabits = habits.filter((habit) => isHabitDueOn(habit, todayDateKey));
  const completedHabitIds = new Set(
    checkins
      .filter((checkin) => checkin.date === todayDateKey)
      .map((checkin) => checkin.habitId),
  );
  const completed = dueHabits.filter((habit) => completedHabitIds.has(habit.id)).length;
  const total = dueHabits.length;

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    allDone: total > 0 && completed === total,
  };
}
