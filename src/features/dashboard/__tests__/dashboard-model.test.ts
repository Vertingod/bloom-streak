import { describe, expect, it } from "vitest";

import type { Habit, HabitCheckin } from "@/features/habits/types";
import { buildDashboardModel } from "../dashboard-model";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "local-user",
  name: "Morning water",
  category: "health",
  color: "sage",
  icon: "droplet",
  frequency: "daily",
  startDate: "2026-08-01",
  archived: false,
  displayOrder: 0,
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
};

function checkin(habitId: string, date: string): HabitCheckin {
  return {
    id: `${habitId}-${date}`,
    habitId,
    userId: "local-user",
    date,
    completedAt: `${date}T02:00:00.000Z`,
    createdAt: `${date}T02:00:00.000Z`,
  };
}

describe("buildDashboardModel", () => {
  it("combines due habits, today progress, and per-habit streak stats", () => {
    const model = buildDashboardModel({
      habits: [baseHabit],
      checkins: [
        checkin("habit-1", "2026-08-03"),
        checkin("habit-1", "2026-08-04"),
        checkin("habit-1", "2026-08-05"),
      ],
      todayDateKey: "2026-08-05",
    });

    expect(model.progress).toEqual({
      completed: 1,
      total: 1,
      percentage: 100,
      allDone: true,
    });
    expect(model.habits).toHaveLength(1);
    expect(model.habits[0]).toMatchObject({
      id: "habit-1",
      completedToday: true,
      currentStreak: 3,
      longestStreak: 3,
      totalCheckins: 3,
    });
    expect(model.habits[0].last7Days.map((day) => day.completed)).toEqual([
      false,
      false,
      false,
      false,
      true,
      true,
      true,
    ]);
  });

  it("keeps all habits available for garden-wide achievement totals", () => {
    const weekdayHabit: Habit = {
      ...baseHabit,
      id: "habit-2",
      name: "Weekday writing",
      frequency: "weekdays",
      displayOrder: 1,
    };

    const model = buildDashboardModel({
      habits: [baseHabit, weekdayHabit],
      checkins: [checkin("habit-1", "2026-08-08"), checkin("habit-2", "2026-08-07")],
      todayDateKey: "2026-08-08",
    });

    expect(model.habits.map((habit) => habit.id)).toEqual(["habit-1"]);
    expect(model.allHabits.map((habit) => habit.id)).toEqual(["habit-1", "habit-2"]);
    expect(model.allHabits.find((habit) => habit.id === "habit-2")?.totalCheckins).toBe(1);
  });

  it("counts historical perfect days as a durable garden milestone", () => {
    const secondHabit: Habit = {
      ...baseHabit,
      id: "habit-2",
      name: "Evening stretch",
      displayOrder: 1,
    };

    const model = buildDashboardModel({
      habits: [baseHabit, secondHabit],
      checkins: [
        checkin("habit-1", "2026-08-03"),
        checkin("habit-2", "2026-08-03"),
        checkin("habit-1", "2026-08-04"),
      ],
      todayDateKey: "2026-08-05",
    });

    expect(model.progress.allDone).toBe(false);
    expect(model.perfectDayCount).toBe(1);
  });
});
